// File: src/services/adminService.js

import { getAuthHeaders, handleApiError } from '../utils/auth.js';

const API_URL = 'http://localhost:8080/api/admin';

// --- Dashboard ---
export async function getDashboardStats() {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

// --- Quản lý Sản phẩm (Admin) ---
export async function adminAddProduct(productData) {
    // Lưu ý: Thêm sản phẩm có thể dùng FormData nếu có upload ảnh
    // Ở đây giả định là JSON
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(), // Bỏ 'Content-Type' nếu dùng FormData
        body: JSON.stringify(productData), // hoặc là đối tượng FormData
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

export async function adminUpdateProduct(id, productData) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

export async function adminDeleteProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

// --- Quản lý Đơn hàng (Admin) ---
export async function adminGetOrders() {
    const response = await fetch(`${API_URL}/orders`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

export async function adminUpdateOrderStatus(id, status) {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: status }), // { "status": "PROCESSING" }
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

// --- Quản lý Người dùng (Admin) ---
export async function adminGetUsers() {
    const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

export async function adminUpdateUserStatus(id, statusData) {
    // (API của bạn là PUT /api/admin/users/{id}/status, nhưng không rõ body
    // Giả sử body là { "active": true } hoặc gì đó tương tự)
    const response = await fetch(`${API_URL}/users/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(statusData),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}