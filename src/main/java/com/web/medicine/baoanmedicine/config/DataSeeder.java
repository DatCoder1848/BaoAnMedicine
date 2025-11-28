package com.web.medicine.baoanmedicine.config;

import com.web.medicine.baoanmedicine.model.*;
import com.web.medicine.baoanmedicine.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Chỉ tạo dữ liệu nếu Database đang trống (tránh tạo trùng lặp khi restart)
        if (roleRepository.count() == 0) {
            seedRoles();
            seedUsers();
            seedCategoriesAndProducts();
        }
    }

    private void seedRoles() {
        Role adminRole = new Role();
        adminRole.setName(RoleName.ROLE_ADMIN);
        roleRepository.save(adminRole);

        Role customerRole = new Role();
        customerRole.setName(RoleName.ROLE_CUSTOMER);
        roleRepository.save(customerRole);
    }

    private void seedUsers() {
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).get();
        Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER).get();

        // 1. Tạo Admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@baoan.com");
        admin.setPassword(passwordEncoder.encode("123456")); // Pass: 123456
        admin.setFullName("Quản Trị Viên");
        admin.setRoles(new HashSet<>(Collections.singletonList(adminRole)));
        userRepository.save(admin);

        // 2. Tạo Khách hàng (User để test chat)
        User user = new User();
        user.setUsername("baoan");
        user.setEmail("khach@baoan.com");
        user.setPassword(passwordEncoder.encode("123456")); // Pass: 123456
        user.setFullName("Nguyễn Bảo An");
        user.setRoles(new HashSet<>(Collections.singletonList(customerRole)));
        userRepository.save(user);

        System.out.println("✅ Đã tạo User mẫu: admin/123456 và baoan/123456");
    }

    private void seedCategoriesAndProducts() {
        // 1. Tạo Danh mục
        Category catGiamDau = new Category();
        catGiamDau.setName("Thuốc Giảm Đau");
        catGiamDau.setDescription("Các loại thuốc giảm đau, hạ sốt");
        categoryRepository.save(catGiamDau);

        Category catTieuHoa = new Category();
        catTieuHoa.setName("Tiêu Hóa");
        categoryRepository.save(catTieuHoa);

        // 2. Tạo Sản phẩm 1: Panadol Extra
        Product p1 = new Product();
        p1.setName("Panadol Extra");
        p1.setDescription("Giảm đau hạ sốt hiệu quả, không gây buồn ngủ.");
        p1.setPrice(new BigDecimal("15000")); // Giá bán
        p1.setOriginalPrice(new BigDecimal("18000")); // Giá gốc (để hiển thị giảm giá)

        p1.setUnit("Hộp 15 vỉ");
        p1.setExpiryString("36 tháng kể từ NSX");
        p1.setIngredients("Paracetamol 500mg, Caffeine 65mg");
        p1.setSideEffects("Có thể gây dị ứng da, buồn nôn nếu dùng quá liều.");
        p1.setStorageInstructions("Nơi khô ráo, tránh ánh nắng trực tiếp.");
        p1.setTherapeuticClass("Giảm đau, Hạ sốt, Đau đầu");

        p1.setCategory(catGiamDau);
        p1.setImageUrl("https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/00000294_panadol_extra_glaxosmithkline_15x12_5352_603d_large_f596395b23.jpg");

        // Thêm ảnh gallery
        List<String> gallery1 = new ArrayList<>();
        gallery1.add("https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/00000294_panadol_extra_glaxosmithkline_15x12_5352_603d_large_f596395b23.jpg");
        gallery1.add("https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_0349_2f57497d5d.jpg");
        p1.setImages(gallery1);

        productRepository.save(p1);

        // 3. Nhập kho cho Panadol (Quan trọng: Nếu không nhập kho, Chatbot sẽ bảo hết hàng)
        Inventory inv1 = new Inventory();
        inv1.setProduct(p1);
        inv1.setBatchNumber("LÔ_001");
        inv1.setInitialQuantity(100);
        inv1.setCurrentQuantity(100); // Còn 100 hộp
        inv1.setImportDate(LocalDate.now());
        inv1.setExpirationDate(LocalDate.now().plusYears(2)); // Hết hạn sau 2 năm
        inv1.setLocation("Kệ A1");
        inventoryRepository.save(inv1);

        // Tạo Berberin với đầy đủ thông tin
        Product p2 = new Product();
        p2.setName("Berberin Mộc Hương");
        p2.setPrice(new BigDecimal("25000"));
        p2.setOriginalPrice(new BigDecimal("30000"));
        p2.setUnit("Lọ 100 viên");
        p1.setExpiryString("36 tháng kể từ NSX");
        p2.setIngredients("Berberin clorid, Mộc hương");
        p2.setSideEffects("Có thể gây dị ứng da, buồn nôn nếu dùng quá liều.");
        p2.setStorageInstructions("Nơi khô ráo, tránh ánh nắng trực tiếp.");
        p2.setTherapeuticClass("Tiêu hóa, Đau bụng");
        p2.setCategory(catTieuHoa);
        p2.setImageUrl("https://example.com/berberin.jpg");
        productRepository.save(p2);

        // 5. Nhập kho cho Berberin
        Inventory inv2 = new Inventory();
        inv2.setProduct(p2);
        inv2.setBatchNumber("LÔ_002");
        inv2.setInitialQuantity(50);
        inv2.setCurrentQuantity(50);
        inv2.setImportDate(LocalDate.now());
        inv2.setExpirationDate(LocalDate.now().plusYears(1));
        inv2.setLocation("Kệ B2");
        inventoryRepository.save(inv2);

        System.out.println("✅ Đã tạo Dữ liệu mẫu: Danh mục, Sản phẩm & Tồn kho.");
    }
}