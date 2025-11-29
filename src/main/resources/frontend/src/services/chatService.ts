import api from './api';
import { ChatResponseDTO } from '../types/chat';

export const ChatService = {
    sendMessage: async (message: string): Promise<ChatResponseDTO> => {
        // API backend của bạn yêu cầu body là { message: string } (dựa theo DTO chuẩn)
        const response = await api.post<ChatResponseDTO>('/chat/send', { message });
        return response.data;
    }
};