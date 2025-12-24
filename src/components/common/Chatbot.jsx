
import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse } from '../../services/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Cpu, Zap } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm your SkillGPS Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (text = inputValue) => {
        if (!text.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            text: text,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Using local static response instead of external AI
            const responseText = await generateAIResponse(text);

            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: responseText,
                sender: 'bot'
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "Sorry, I encountered an error.",
                sender: 'bot'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const QuickAction = ({ text }) => (
        <button
            onClick={() => handleSendMessage(text)}
            style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-light)',
                borderRadius: '16px',
                padding: '4px 12px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
        >
            {text}
        </button>
    );

    return (
        <div className="chatbot-wrapper">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="chatbot-header">
                            <div className="chatbot-title">
                                <Sparkles size={18} />
                                <span>SkillGPS Assistant</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={toggleChat} className="chatbot-close-btn">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="chatbot-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message message-bot">
                                    <span style={{ fontSize: '1.2rem', lineHeight: '10px' }}>
                                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
                                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
                                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
                                    </span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {messages.length < 3 && (
                            <div style={{ padding: '0 16px 8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                <QuickAction text="Recommend a course" />
                                <QuickAction text="Interview tips" />
                                <QuickAction text="Career advice" />
                            </div>
                        )}

                        <div className="chatbot-input-area">
                            <input
                                type="text"
                                placeholder="Ask anything..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="chatbot-input"
                            />
                            <button onClick={() => handleSendMessage()} className="chatbot-send-btn">
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button onClick={toggleChat} className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}>
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
};

export default Chatbot;
