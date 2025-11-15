// File: src/services/cartService.js

import { getAuthHeaders, handleApiError } from '../utils/auth.js';

const API_URL = 'http://localhost:8080/api/cart';

/**
 * Lấy giỏ hàng hiện tại
 * @returns {Promise<object>}
 */
export async function getCart() {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

/**
 * Thêm sản phẩm vào giỏ
 * @param {number} productId
 * @param {number} quantity
 * @returns {Promise<object>}
 */
export async function addToCart(productId, quantity) {
    const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

/**
 * Cập nhật số lượng sản phẩm
 * @param {number} productId
 * @param {number} quantity
 * @returns {Promise<object>}
 */
export async function updateCart(productId, quantity) {
    const response = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}

/**
 * Xóa sản phẩm khỏi giỏ
 * @param {number} productId
 * @returns {Promise<object>}
 */
export async function removeFromCart(productId) {
    const response = await fetch(`${API_URL}/remove/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
}