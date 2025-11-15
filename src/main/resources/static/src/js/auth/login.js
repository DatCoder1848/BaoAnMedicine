// File: src/js/auth/login.js

// Import các hàm từ 2 file kia
// (Lưu ý: đường dẫn tương đối phải chính xác)
import { login } from '../../services/authService.js';
import { saveToken } from '../../utils/storage.js';

// Chờ cho toàn bộ nội dung HTML được tải xong
document.addEventListener('DOMContentLoaded', function () {

    // Tìm các phần tử trong file login.html
    const loginForm = document.getElementById('login-form'); // <form id="login-form">
    const usernameInput = document.getElementById('username'); // <input id="username">
    const passwordInput = document.getElementById('password'); // <input id="password">
    const errorMessages = document.getElementById('error-messages'); // <div id="error-messages">

    // Gắn sự kiện "submit" cho form
    loginForm.addEventListener('submit', async function (event) {
        // Ngăn trình duyệt tự động tải lại trang
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            // 1. Gọi service để đăng nhập
            const data = await login(username, password);

            // 2. Nếu thành công, lưu token lại
            if (data.accessToken) {
                saveToken(data.accessToken);

                // 3. Thông báo thành công và chuyển hướng về trang chủ
                alert('Đăng nhập thành công!');
                // (Giả sử trang chủ customer nằm ở /pages/customer/index.html)
                window.location.href = '../customer/index.html';
            } else {
                throw new Error('Không nhận được token từ server');
            }

        } catch (error) {
            // 4. Nếu thất bại, hiển thị lỗi
            console.error('Lỗi đăng nhập:', error);
            errorMessages.textContent = error.message;
        }
    });
});