// File: src/utils/storage.js

const TOKEN_KEY = 'authToken';

/**
 * Lưu token vào Local Storage
 * @param {string} token - Chuỗi JWT Token
 */
export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Lấy token từ Local Storage
 * @returns {string | null} Chuỗi JWT Token hoặc null nếu không có
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Xóa token khỏi Local Storage (khi đăng xuất)
 */
export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa (bằng cách xem có token không)
 * @returns {boolean}
 */
export function isLoggedIn() {
    const token = getToken();
    return !!token; // !! convert string/null thành true/false
}