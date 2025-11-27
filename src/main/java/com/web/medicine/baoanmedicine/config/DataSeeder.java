package com.web.medicine.baoanmedicine.config;

import com.web.medicine.baoanmedicine.model.*;
import com.web.medicine.baoanmedicine.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;

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

        // 2. Tạo Sản phẩm 1: Panadol (Để test chat "đau đầu")
        Product p1 = new Product();
        p1.setName("Panadol Extra");
        p1.setDescription("Giảm đau hạ sốt hiệu quả");
        p1.setPrice(new BigDecimal("15000"));
        p1.setTherapeuticClass("Giảm đau, Hạ sốt"); // Quan trọng cho tìm kiếm
        p1.setCategory(catGiamDau);
        p1.setImageUrl("https://example.com/panadol.jpg");
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

        // 4. Tạo Sản phẩm 2: Berberin (Để test chat "đau bụng")
        Product p2 = new Product();
        p2.setName("Berberin");
        p2.setDescription("Hỗ trợ điều trị rối loạn tiêu hóa");
        p2.setPrice(new BigDecimal("25000"));
        p2.setTherapeuticClass("Tiêu hóa, Cầm đi ngoài");
        p2.setCategory(catTieuHoa);
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