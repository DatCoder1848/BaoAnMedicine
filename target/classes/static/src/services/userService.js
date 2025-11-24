// File: src/services/userService.js

import { getAuthHeaders, handleApiError } from '../utils/auth.js';

const API_URL = 'http://localhost:8080/api/users';

/**
 * Lấy thông tin hồ sơ người dùng hiện tại
 * @returns {Promise<object>} (Thông tin user)
 */
export async function getProfile() {
    const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: getAuthHeaders(), // <-- Cần token
    });

    if (!response.ok) {
        await handleApiError(response);
    }
    return response.json();
}

/**
 * Cập nhật thông tin hồ sơ
 * @param {object} profileData ({ fullName, address, phoneNumber })
 * @returns {Promise<object>} (Thông tin user đã cập nhật)
 */
export async function updateProfile(profileData) {
    const response = await fetch(`${API_URL}/me`, {
        method: 'PUT',
        headers: getAuthHeaders(), // <-- Cần token
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        await handleApiError(response);
    }
    return response.json();
}