# BaoAnMedicine
🤓Dự án lập trình web bán lẻ thuốc👨‍⚕️


1. Quản lý Tài khoản (User & Authentication)
ID	Mô tả Chi tiết (User Story)	Vai trò
F-U1	Người dùng có thể Đăng ký tài khoản bằng username, email, password.	Customer
F-U2	Người dùng có thể Đăng nhập và hệ thống phải kiểm tra vai trò (role) để cấp quyền truy cập phù hợp.	All Roles
F-U3	Người dùng có thể xem và Cập nhật thông tin cá nhân (tên, số điện thoại, địa chỉ mặc định).	Customer
F-U4	Admin có thể Quản lý (CRUD) tài khoản của người dùng (tạo, xem, chỉnh sửa, khóa/mở khóa).	Admin

Xuất sang Trang tính
2. Quản lý Sản phẩm & Danh mục (Product & Catalog)
ID	Mô tả Chi tiết (User Story)	Vai trò
F-P1	Admin có thể Quản lý (CRUD) danh mục thuốc (categories).	Admin
F-P2	Admin có thể Quản lý (CRUD) sản phẩm (products), bao gồm các trường: tên, SKU, giá, giá vốn, số lượng tồn kho, danh mục, đường dẫn ảnh, và cờ is_prescription.	Admin
F-P3	Khách hàng có thể Xem danh sách sản phẩm theo phân loại và sử dụng chức năng tìm kiếm/lọc cơ bản (theo tên/danh mục).	Customer
F-P4	Khách hàng có thể xem Chi tiết sản phẩm, bao gồm mô tả, công dụng và số lượng tồn kho hiện có.	Customer

Xuất sang Trang tính
3. Quy trình Đặt hàng & Giỏ hàng (Order Flow & Cart)
ID	Mô tả Chi tiết (User Story)	Vai trò
F-C1	Khách hàng có thể Thêm sản phẩm vào Giỏ hàng và Cập nhật số lượng trong giỏ.	Customer
F-C2	Hệ thống phải thực hiện Kiểm tra Tồn kho sớm ngay khi sản phẩm được thêm vào/cập nhật số lượng trong giỏ hàng.	System
F-O1	Khách hàng có thể điền thông tin Địa chỉ giao hàng và chọn Phương thức Thanh toán (COD/Online) tại màn hình Checkout.	Customer
F-O2	Hệ thống phải Tạo đơn hàng (tạo record trong orders và order_details) sau khi Checkout thành công.	System
F-O3	Khách hàng có thể xem Lịch sử đặt hàng và Chi tiết đơn hàng của mình.	Customer

Xuất sang Trang tính
4. Quản lý Đơn hàng (Admin/Pharmacist Panel)
ID	Mô tả Chi tiết (User Story)	Vai trò
F-A1	Admin/Pharmacist có thể xem Danh sách tất cả đơn hàng với các bộ lọc theo status.	Admin/Pharmacist
F-A2	Pharmacist (Dược sĩ) có thể Xác nhận toa thuốc (Rx Review), chuyển trạng thái đơn hàng từ PENDING_RX_REVIEW sang PENDING_CONFIRMATION.	Pharmacist
F-A3	Admin có thể Xác nhận đơn hàng, chuyển trạng thái từ PENDING_CONFIRMATION sang CONFIRMED.	Admin
F-A4	Admin có thể Cập nhật trạng thái đơn hàng (CONFIRMED → SHIPPING → DELIVERED).	Admin
F-A5	Admin có thể Hủy đơn hàng và kích hoạt logic Hoàn Tồn kho.	Admin

Xuất sang Trang tính
II. Yêu Cầu Logic Nghiệp vụ (Business Logic/Critical Logic)
Đây là những quy tắc phải được mã hóa vào Backend.

ID	Mô tả Chi tiết	Bảng liên quan
L-C1	Tính tổng tiền: grand_total phải được tính bằng sub_total - discount_amount + shipping_fee.	orders
L-C2	Logic Trừ Tồn kho: Phải được thực hiện trong một Transaction khi trạng thái chuyển từ CONFIRMED sang SHIPPING. Cập nhật $products.stock\_quantity = products.stock\_quantity - order\_details.quantity$.	products, order_details
L-C3	Logic Hoàn Tồn kho: Phải được thực hiện khi trạng thái chuyển sang CANCELLED. Cập nhật $products.stock\_quantity = products.stock\_quantity + order\_details.quantity$.	products, order_details
L-R1	Logic Phân loại Rx: Nếu bất kỳ sản phẩm nào trong order_details có is_prescription = 1, đơn hàng phải được đặt trạng thái ban đầu là PENDING_RX_REVIEW.	orders, products
L-P1	Quản lý Thanh toán Online (MVP): Khi giao dịch giả lập thành công, hệ thống phải: (1) Tạo record SUCCESS trong bảng payments. (2) Cập nhật orders.is_paid = 1.	payments, orders

Xuất sang Trang tính
III. Yêu Cầu Phi Chức năng (Non-Functional Requirements)
ID	Loại	Mô tả Chi tiết
N-S1	Bảo mật	Mật khẩu người dùng phải được Hash (ví dụ: BCrypt, Argon2) trước khi lưu vào CSDL.
N-S2	Bảo mật	Tất cả các API cần xác thực Token (ví dụ: JWT) để đảm bảo chỉ người dùng đã đăng nhập và có quyền hợp lệ mới được truy cập.
N-P1	Hiệu suất	Thời gian phản hồi của các API quan trọng (Đăng nhập, Tạo Đơn hàng) không được vượt quá 500ms.
N-T1	Kiểm thử	Backend cần được thiết lập môi trường để thực hiện Unit Test cho các logic nghiệp vụ quan trọng (Tồn kho, Rx).
N-T2	Khả năng sử dụng	Giao diện phải Responsive (hiển thị tốt trên cả desktop và mobile).
