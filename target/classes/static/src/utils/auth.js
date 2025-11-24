// File: src/utils/auth.js

import { getToken, removeToken } from './storage.js';

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa
 * @returns {boolean}
 */
export function isLoggedIn() {
    const token = getToken();
    return !!token; // !! convert string/null thành true/false
}

/**
 * Đăng xuất người dùng: Xóa token và chuyển về trang đăng nhập
 */
export function logout() {
    removeToken();
    // Điều chỉnh đường dẫn này cho đúng với file login.html của bạn
    window.location.href = '/pages/auth/login.html';
}

/**
 * Lấy header chứa token để gửi kèm API
 * @returns {HeadersInit}
 */
export function getAuthHeaders() {
    const token = getToken();

    // Header mặc định
    const headers = {
        'Content-Type': 'application/json',
    };

    // Nếu có token, thêm vào header Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Hàm xử lý lỗi API chung. Nếu lỗi 401/403 (chưa xác thực) sẽ tự động logout.
 * @param {Response} response - Đối tượng response từ fetch()
 */
export async function handleApiError(response) {
    if (response.status === 401 || response.status === 403) {
        // Token không hợp lệ hoặc hết hạn
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        logout();
    }

    const errorData = await response.json();
    throw new Error(errorData.message || 'Một lỗi không xác định đã xảy ra.');
}