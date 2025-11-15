// File: src/services/productService.js
// (Gộp chung service cho Category và Product vì đều là public)

import { handleApiError } from '../utils/auth.js';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Lấy tất cả danh mục
 * @returns {Promise<Array>}
 */
export async function getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) await handleApiError(response);
    return response.json();
}

/**
 * Lấy danh sách sản phẩm (có lọc, phân trang)
 * @param {object} params (ví dụ: { page: 1, limit: 10, categoryId: 2 })
 * @returns {Promise<Array>}
 */
export async function getProducts(params = {}) {
    // Chuyển object params thành query string (ví dụ: ?page=1&limit=10)
    const query = new URLSearchParams(params).toString();

    const response = await fetch(`${API_BASE_URL}/products?${query}`);
    if (!response.ok) await handleApiError(response);
    return response.json();
}

/**
 * Tìm kiếm sản phẩm
 * @param {string} query (ví dụ: "paracetamol")
 * @returns {Promise<Array>}
 */
export async function searchProducts(query) {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) await handleApiError(response);
    return response.json();
}

/**
 * Lấy chi tiết 1 sản phẩm
 * @param {string | number} id
 * @returns {Promise<object>}
 */
export async function getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) await handleApiError(response);
    return response.json();
}