import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatService } from '../../services/chatService';
import { ChatMessage } from '../../types/chat';

const ChatWidget: React.FC = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'init', sender: 'bot', text: 'Xin chào! Tôi là trợ lý ảo Bảo An. Tôi có thể giúp gì cho bạn?', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- DRAG & DROP LOGIC ---
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Xử lý khi bắt đầu kéo
    const handleMouseDown = (e: React.MouseEvent) => {
        // Chỉ cho phép kéo khi click vào nút icon tròn (khi đóng) hoặc header (khi mở)
        setIsDragging(false);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y,
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return;

        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        // Đánh dấu là đang kéo nếu di chuyển quá 5px (để phân biệt với Click)
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            setIsDragging(true);
        }

        setPosition({
            x: dragRef.current.initialX + dx,
            y: dragRef.current.initialY + dy,
        });
    };

    const handleMouseUp = () => {
        if (!dragRef.current) return;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        dragRef.current = null;

        // --- LOGIC SNAP TO EDGE (Dính biên) ---
        // Nếu thả chuột ra, tính toán xem gần biên trái hay phải hơn
        const screenWidth = window.innerWidth;
        const threshold = screenWidth / 2;

        // Lấy vị trí hiện tại sau khi thả
        setPosition((prev) => {
            let newX = prev.x;
            // Nếu đang mở khung chat thì không snap gắt quá, giữ nguyên hoặc căn chỉnh nhẹ
            // Nhưng nếu đang là icon tròn (đóng) thì snap vào lề
            if (!isOpen) {
                newX = prev.x < threshold ? 20 : screenWidth - 80; // Cách lề 20px hoặc 80px
            } else {
                // Giới hạn không cho bay ra ngoài màn hình
                if (prev.x < 0) newX = 10;
                if (prev.x > screenWidth - 350) newX = screenWidth - 360; // 350 là width của box chat
            }

            // Giới hạn Y không bay mất header/footer
            let newY = prev.y;
            if (newY < 50) newY = 50;
            if (newY > window.innerHeight - 100) newY = window.innerHeight - 100;

            return { x: newX, y: newY };
        });

        // Reset cờ drag sau một khoảng ngắn để tránh conflict click
        setTimeout(() => setIsDragging(false), 100);
    };

    // --- CHAT LOGIC ---
    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue;
        setInputValue('');

        // 1. Add User Message
        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: userText, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            // 2. Call API
            const data = await ChatService.sendMessage(userText);

            // 3. Add Bot Message
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: data.botResponse,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);

            // 4. Navigate nếu có (Logic thông minh)
            if (data.navigateUrl) {
                navigate(data.navigateUrl);
            }
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: 'Xin lỗi, tôi đang gặp sự cố kết nối.', timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 9999, // Luôn nổi lên trên cùng
                touchAction: 'none' // Chặn touch mặc định để xử lý drag
            }}
            className="transition-all duration-300 ease-out"
        >
            {/* --- TRẠNG THÁI ĐÓNG: ICON TRÒN --- */}
            {!isOpen && (
                <div
                    onMouseDown={handleMouseDown}
                    onClick={() => !isDragging && setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center cursor-move hover:scale-110 transition-transform text-white animate-bounce-slow"
                >
                    <MessageCircle className="w-8 h-8" />
                    {/* Badge thông báo nhỏ nếu cần */}
                    <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
                </div>
            )}

            {/* --- TRẠNG THÁI MỞ: KHUNG CHAT --- */}
            {isOpen && (
                <div className="flex flex-col w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden font-sans">

                    {/* Header (Vùng kéo thả) */}
                    <div
                        onMouseDown={handleMouseDown}
                        className="bg-gradient-to-r from-cyan-600 to-blue-700 p-4 flex items-center justify-between cursor-move select-none text-white"
                    >
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold text-sm">Trợ lý Bảo An</h3>
                                <p className="text-xs text-cyan-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                                <Minus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body (List tin nhắn) */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer (Input) */}
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !inputValue.trim()}
                            className="p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 disabled:opacity-50 transition-colors shadow-md"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;