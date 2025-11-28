// src/types/auth.ts

// Dữ liệu gửi đi khi Đăng nhập
export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

// Dữ liệu gửi đi khi Đăng ký
export interface RegisterRequest {
    username: string; // Backend yêu cầu username
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string; // Tùy chọn nếu backend của bạn đã update thêm trường này
}

// Dữ liệu Backend trả về khi login thành công
export interface JwtResponse {
    accessToken: string;
    tokenType: string;
}