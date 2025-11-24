// File: src/services/orderService.js

import { getAuthHeaders, handleApiError } from '../utils/auth.js';

const API_URL = 'http://localhost:8080/api/orders';

/**
 * Tạo đơn hàng mới (Thanh toán)
 * @param {object} checkoutData ({ shippingAddress, shippingPhone, paymentMethod })
 * @returns {Promise<object>}
 */
export async function checkout(checkoutData) {
    const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(checkoutData),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

/**
 * Lấy lịch sử đơn hàng của cá nhân
 * @returns {Promise<Array>}
 */
export async function getMyOrders() {
    const response = await fetch(`${API_URL}/my-orders`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

/**
 * Lấy chi tiết 1 đơn hàng của cá nhân
 * @param {number | string} id
 * @returns {Promise<object>}
 */
export async function getMyOrderById(id) {
    const response = await fetch(`${API_URL}/my-orders/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}