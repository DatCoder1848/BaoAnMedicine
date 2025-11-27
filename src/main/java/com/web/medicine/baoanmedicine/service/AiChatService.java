package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.response.ChatResponseDTO;
import com.web.medicine.baoanmedicine.dto.gemini.GeminiRequest;
import com.web.medicine.baoanmedicine.dto.gemini.GeminiResponse;
import com.web.medicine.baoanmedicine.model.ChatHistory;
import com.web.medicine.baoanmedicine.model.Product;
import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.repository.ChatHistoryRepository;
import com.web.medicine.baoanmedicine.repository.ProductRepository; // Cần cái này để tìm thuốc
import com.web.medicine.baoanmedicine.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate; // Dùng để gọi API Google

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AiChatService {

    @Autowired private ChatHistoryRepository chatHistoryRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository; // Để lấy dữ liệu thật
    @Autowired private InventoryService inventoryService;   // Để lấy tồn kho thật

    // Phải khớp từng chữ với cấu trúc trong application.yml (gemini -> api -> url)
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public ChatResponseDTO processChat(Long userId, String userMessage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. TÌM DỮ LIỆU LIÊN QUAN TRONG DB (RAG)
        String contextData = findRelevantProductData(userMessage);

        // 2. TẠO PROMPT (Kịch bản cho AI)
        String prompt = createSystemPrompt(user.getFullName(), userMessage, contextData);

        // 3. GỌI GEMINI API
        String botResponse = callGeminiApi(prompt);

        // 4. LƯU LỊCH SỬ
        ChatHistory history = new ChatHistory();
        history.setUser(user);
        history.setUserMessage(userMessage);
        history.setBotResponse(botResponse);

        // Logic tạo Link
        String navigateUrl = null;

        // Tìm sản phẩm liên quan nhất để lấy link
        // (Ta dùng lại logic lọc trong hàm findRelevantProductData nhưng lấy object Product ra)
        Product bestMatch = findBestMatchProduct(userMessage); // Bạn tách logic lọc ra thành hàm riêng

        if (bestMatch != null) {
            // Chỉ in log khi chắc chắn bestMatch KHÔNG null
            System.out.println("💊💊 Best Match Product: " + bestMatch.getName() + " (ID: " + bestMatch.getProductId() + ")");

            // Tạo link đến trang chi tiết sản phẩm
            navigateUrl = "/products/" + bestMatch.getProductId();
            System.out.println("🔗🩺 Navigate Url: " + navigateUrl);

            // Nếu khách hỏi chung về bệnh mà sản phẩm tìm được cũng thuộc nhóm đó -> Ưu tiên link sản phẩm
            // (Logic cũ của bạn đang dùng bestMatch.getCategory() bên trong if này là an toàn)
        }
        else {
            // TRƯỜNG HỢP KHÔNG TÌM THẤY SẢN PHẨM CỤ THỂ (bestMatch == null)
            System.out.println("🚫 Không tìm thấy sản phẩm khớp chính xác.");

            // Fallback: Kiểm tra từ khóa bệnh để trỏ về DANH MỤC (Category)
            // Lưu ý: ID danh mục (ví dụ: 1, 2) bạn nên lấy từ DB hoặc cấu hình Constants
            if (userMessage.toLowerCase().contains("đau đầu") || userMessage.toLowerCase().contains("hạ sốt")) {
                navigateUrl = "category/1"; // Ví dụ: ID 1 là danh mục Giảm đau
            }
            else if (userMessage.toLowerCase().contains("tiêu hóa") || userMessage.toLowerCase().contains("đau bụng")) {
                navigateUrl = "category/2"; // Ví dụ: ID 2 là danh mục Tiêu hóa
            }
        }

        chatHistoryRepository.save(history);

        return new ChatResponseDTO(userMessage, botResponse, navigateUrl, LocalDateTime.now());
    }

    // --- CÁC HÀM HỖ TRỢ ---

    // Hàm 1: Tìm kiếm sản phẩm trong DB dựa trên câu hỏi của khách
    private record ProductMatch(Product product, int distance) {}

    // ... các autowired ...

    // HÀM MỚI: TÌM KIẾM THÔNG MINH (NATURAL LANGUAGE MATCHING)
    private String findRelevantProductData(String userMessage) {
        String lowerMsg = userMessage.toLowerCase();

        // 1. Lấy toàn bộ sản phẩm (Hoặc dùng Cache nếu dữ liệu lớn)
        // Vì số lượng thuốc không quá nhiều, lấy hết để so sánh cho chính xác
        List<Product> allProducts = productRepository.findAll();

        // 2. Lọc thông minh (Java Stream)
        // Logic: Giữ lại sản phẩm NẾU [Tin nhắn khách] CÓ CHỨA [Tên thuốc] HOẶC [Công dụng]
        List<Product> matchedProducts = allProducts.stream()
                .filter(p -> {
                    String name = p.getName().toLowerCase();
                    String function = p.getTherapeuticClass() != null ? p.getTherapeuticClass().toLowerCase() : "";

                    // Tách các từ khóa công dụng (ví dụ "Giảm đau, Hạ sốt" -> "giảm đau", "hạ sốt")
                    boolean functionMatch = false;
                    for (String key : function.split(",")) {
                        if (lowerMsg.contains(key.trim())) {
                            functionMatch = true;
                            break;
                        }
                    }

                    // Kiểm tra: Tin nhắn có chứa Tên thuốc hoặc Công dụng không?
                    // Ví dụ: Khách nhắn "đau đầu" -> Chứa "đau" (trong giảm đau) -> Match (Cần tinh chỉnh data)
                    // Ở đây ta so sánh chính xác cụm từ
                    return lowerMsg.contains(name) || functionMatch;
                })
                .limit(5)
                .collect(Collectors.toList());

        if (matchedProducts.isEmpty()) {
            // FALLBACK: Nếu không khớp chính xác, thử tìm kiếm "mờ" (Fuzzy) đơn giản
            // Ví dụ: tìm các từ đơn lẻ "đau", "sốt"
            matchedProducts = allProducts.stream()
                    .filter(p -> lowerMsg.contains("đau") && p.getTherapeuticClass().toLowerCase().contains("giảm đau"))
                    .limit(3)
                    .collect(Collectors.toList());

            if (matchedProducts.isEmpty()) return ""; // Trả về rỗng để Bot tự xử lý
        }

        // 3. Tạo chuỗi dữ liệu gửi cho Gemini
        StringBuilder data = new StringBuilder();
        for (Product p : matchedProducts) {
            int stock = inventoryService.getRealStock(p.getProductId());
            data.append(String.format("- Sản phẩm: %s | Giá: %s VNĐ | Công dụng: %s | Tồn kho: %d\n",
                    p.getName(), p.getPrice(), p.getTherapeuticClass(), stock));
        }
        return data.toString();
    }

    // Hàm 2: Tạo kịch bản cho AI
    private String createSystemPrompt(String userName, String userMessage, String contextData) {
        return String.format(
                // Phần 1: Tối ưu Vai trò và Giới hạn an toàn (SAFE GUARDS)
                "Bạn là Dược sĩ AI của nhà thuốc Bảo An Medicine, chuyên hỗ trợ khách hàng tên %s.\n" +
                        "Các quy tắc BẮT BUỘC:\n" +
                        "A. Luôn trả lời lịch sự, thân thiện, và chuyên nghiệp như một Dược sĩ.\n" +
                        "B. TUYỆT ĐỐI không chẩn đoán bệnh hay kê đơn thuốc. Chỉ cung cấp thông tin sản phẩm và liều dùng theo hướng dẫn có sẵn.\n" +
                        "C. CHỈ DÙNG thông tin trong mục 'DỮ LIỆU KHO' bên dưới để trả lời.\n" +

                        // Phần 2: Dữ liệu Grounding
                        "--- DỮ LIỆU KHO VÀ SẢN PHẨM ---\n" +
                        "%s\n" +
                        "--- KẾT THÚC DỮ LIỆU KHO ---\n" +

                        // Phần 3: Yêu cầu hành động cụ thể
                        "Dựa trên các quy tắc và dữ liệu kho trên, hãy thực hiện yêu cầu sau:\n" +
                        "1. Nếu có sản phẩm liên quan trong dữ liệu kho (và Tồn kho > 0), hãy tư vấn về công dụng và giá.\n" +
                        "2. Nếu Tồn kho = 0, hãy báo HẾT HÀNG một cách khéo léo và hỏi xem khách có muốn tìm sản phẩm thay thế không.\n" +
                        "3. Nếu không tìm thấy sản phẩm nào trong dữ liệu kho, hãy nói khéo là nhà thuốc chưa có sản phẩm đó và hỏi xem khách cần hỗ trợ gì thêm.\n" +

                        "Câu hỏi của khách: \"%s\"",
                userName, contextData, userMessage
        );
    }

    // Hàm 3: Gọi API Google
    // --- SỬA THÊM HÀM callGeminiApi ĐỂ DEBUG ---
    private String callGeminiApi(String prompt) {
        try {
            // Ghép URL và Key
            String finalUrl = geminiApiUrl + geminiApiKey;

            // IN RA CONSOLE ĐỂ KIỂM TRA (DEBUG)
            System.out.println("🤖 Đang gọi AI URL: " + geminiApiUrl + "HIDDEN_KEY");

            GeminiRequest request = new GeminiRequest(prompt);
            GeminiResponse response = restTemplate.postForObject(finalUrl, request, GeminiResponse.class);

            if (response != null && !response.getCandidates().isEmpty()) {
                return response.getCandidates().get(0).getContent().getParts().get(0).getText();
            }
            return "Hệ thống AI đang bận, không có phản hồi.";
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi đầy đủ ra console để xem
            return "Xin lỗi, tôi đang gặp sự cố kết nối AI (Lỗi: " + e.getMessage() + ")";
        }
    }

    private Product findBestMatchProduct(String userMessage) {
        String lowerCaseMessage = userMessage.toLowerCase();

        // 1. Tìm nhanh trong Database (Tên hoặc Công dụng chứa từ khóa)
        // Lấy tối đa 10 sản phẩm để lọc
        List<Product> potentialProducts = productRepository.searchByNameOrFunction(
                lowerCaseMessage,
                PageRequest.of(0, 10)
        ).getContent();

        if (potentialProducts.isEmpty()) {
            return null; // Không tìm thấy gì
        }

        // 2. Dùng thuật toán Levenshtein để tìm ra sản phẩm có tên "giống nhất"
        // Mục đích: Để ưu tiên sản phẩm có tên ngắn gọn, sát nghĩa nhất đưa lên đầu.
        LevenshteinDistance distance = new LevenshteinDistance();

        return potentialProducts.stream()
                .map(p -> {
                    // Tính khoảng cách giữa Tên thuốc và Tin nhắn
                    int dist = distance.apply(p.getName().toLowerCase(), lowerCaseMessage);
                    return new ProductMatch(p, dist);
                })
                .sorted(Comparator.comparingInt(ProductMatch::distance)) // Sắp xếp khoảng cách nhỏ nhất (giống nhất) lên đầu
                .map(ProductMatch::product) // Lấy ra đối tượng Product
                .findFirst() // Lấy cái đầu tiên
                .orElse(null);
    }
}

