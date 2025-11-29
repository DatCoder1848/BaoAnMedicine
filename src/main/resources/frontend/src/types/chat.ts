export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

export interface ChatResponseDTO {
    userMessage: string;
    botResponse: string;
    navigateUrl?: string; // Bot có thể trả về link để redirect
}