// File: src/services/authService.js

import { handleApiError } from '../utils/auth.js';

const API_URL = 'http://localhost:8080/api/auth';

/**
 * Gọi API để đăng nhập
 * @param {string} usernameOrEmail
 * @param {string} password
 * @returns {Promise<object>} (ví dụ: { accessToken: "..." })
 */
export async function login(usernameOrEmail, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
    });

    if (!response.ok) {
        await handleApiError(response);
    }
    return response.json();
}

/**
 * Gọi API để đăng ký
 * @param {object} userData ( { username, email, password, fullName } )
 * @returns {Promise<object>}
 */
export async function register(userData) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        await handleApiError(response);
    }
    return response.json();
}