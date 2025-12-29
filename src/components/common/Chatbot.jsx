import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse } from '../../services/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Cpu, Zap } from 'lucide-react';
import './Chatbot.css';
import { interviewQuestions } from '../../data/interviewQuestions';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm your SkillGPS Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Interaction Modes: 'normal', 'selecting_domain', 'answering_question', 'post_answer'
    const [interactionMode, setInteractionMode] = useState('normal');
    const [currentContext, setCurrentContext] = useState({ domain: null, questionIndex: null });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const toggleChat = () => setIsOpen(!isOpen);

    const addBotMessage = (text) => {
        setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: text,
            sender: 'bot'
        }]);
    };

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
            // INTERVIEW MODE LOGIC
            // 1. Trigger Interview Mode
            if (interactionMode === 'normal' && (text.toLowerCase().includes('interview') || text.toLowerCase().includes('question'))) {
                setTimeout(() => {
                    const savedDomains = localStorage.getItem('suggestedDomains');
                    let domains = [];
                    if (savedDomains) {
                        try {
                            const parsed = JSON.parse(savedDomains);
                            domains = parsed.map(d => d.career);
                        } catch (e) {
                            console.error("Failed to parse suggested domains", e);
                        }
                    }

                    // Fallback if no domains found
                    if (domains.length === 0) {
                        domains = Object.keys(interviewQuestions);
                    }

                    addBotMessage("Great! Let's practice some interview questions. Based on your profile, here are some suggested domains:");

                    // Show domains as buttons (handled in render, but we can also just list them textually or add a special message type)
                    // For now, let's just list them and ask user to type/click
                    // Actually, let's use a special "system" message or just text
                    const domainList = domains.join(', ');
                    addBotMessage(`Which domain would you like to practice? (${domainList})`);

                    setInteractionMode('selecting_domain');
                    setIsTyping(false);
                }, 800);
                return;
            }

            // 2. Select Domain
            if (interactionMode === 'selecting_domain') {
                setTimeout(() => {
                    const selectedDomain = Object.keys(interviewQuestions).find(d =>
                        text.toLowerCase().includes(d.toLowerCase())
                    );

                    if (selectedDomain) {
                        const questions = interviewQuestions[selectedDomain];
                        const randomIndex = Math.floor(Math.random() * questions.length);
                        const questionObj = questions[randomIndex];

                        setCurrentContext({ domain: selectedDomain, questionIndex: randomIndex });
                        addBotMessage(`Okay, here is a ${selectedDomain} interview question:`);
                        addBotMessage(questionObj.question);
                        addBotMessage("Please type your answer below.");

                        setInteractionMode('answering_question');
                    } else {
                        addBotMessage("I didn't recognize that domain. Please choose from: " + Object.keys(interviewQuestions).join(', '));
                    }
                    setIsTyping(false);
                }, 800);
                return;
            }

            // 3. Answer Question
            if (interactionMode === 'answering_question') {
                setTimeout(() => {
                    const { domain, questionIndex } = currentContext;
                    const questionObj = interviewQuestions[domain][questionIndex];

                    addBotMessage(`Your Answer: ${text}`);
                    addBotMessage("Here is the correct answer/explanation:");
                    addBotMessage(questionObj.answer);
                    addBotMessage(`Explanation: ${questionObj.explanation}`);

                    addBotMessage("Would you like another question? (Yes/No)");
                    setInteractionMode('post_answer');
                    setIsTyping(false);
                }, 1000);
                return;
            }

            // 4. Post Answer Decision
            if (interactionMode === 'post_answer') {
                setTimeout(() => {
                    if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('sure') || text.toLowerCase().includes('ok')) {
                        // Repeat selection or random from same domain? Let's use same domain for continuity
                        const questions = interviewQuestions[currentContext.domain];
                        const randomIndex = Math.floor(Math.random() * questions.length);
                        const questionObj = questions[randomIndex];

                        setCurrentContext(prev => ({ ...prev, questionIndex: randomIndex }));
                        addBotMessage(`Here is another question for ${currentContext.domain}:`);
                        addBotMessage(questionObj.question);
                        setInteractionMode('answering_question');
                    } else {
                        addBotMessage("Alright! Let me know if you need anything else.");
                        setInteractionMode('normal');
                        setCurrentContext({ domain: null, questionIndex: null });
                    }
                    setIsTyping(false);
                }, 800);
                return;
            }

            // Start Normal AI Response
            const responseText = await generateAIResponse(text);
            addBotMessage(responseText);

        } catch (error) {
            addBotMessage("Sorry, I encountered an error.");
        } finally {
            if (interactionMode === 'normal') setIsTyping(false);
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

                        {messages.length < 3 && interactionMode === 'normal' && (
                            <div style={{ padding: '0 16px 8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                <QuickAction text="Recommend a course" />
                                <QuickAction text="Interview tips" />
                                <QuickAction text="Career advice" />
                            </div>
                        )}

                        {interactionMode === 'selecting_domain' && (
                            <div style={{ padding: '0 16px 8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                {(() => {
                                    const saved = localStorage.getItem('suggestedDomains');
                                    let domains = saved ? JSON.parse(saved).map(d => d.career) : Object.keys(interviewQuestions);
                                    if (domains.length === 0) domains = Object.keys(interviewQuestions);

                                    return domains.map(d => (
                                        <QuickAction key={d} text={d} />
                                    ));
                                })()}
                            </div>
                        )}

                        {interactionMode === 'post_answer' && (
                            <div style={{ padding: '0 16px 8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                <QuickAction text="Yes, please" />
                                <QuickAction text="No, thanks" />
                            </div>
                        )}

                        <div className="chatbot-input-area">
                            <input
                                type="text"
                                placeholder={interactionMode === 'answering_question' ? "Type your answer..." : "Ask anything..."}
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
