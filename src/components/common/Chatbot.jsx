import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse } from '../../services/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Cpu, Zap, RefreshCw, Mic, MicOff, Volume2, VolumeX, Upload } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth/mammoth.browser';
import './Chatbot.css';
import { interviewQuestions } from '../../data/interviewQuestions';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm your SkillGPS Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [resumeText, setResumeText] = useState('');

    // Lightweight NLP helpers for answer matching
    const STOP_WORDS = useRef(new Set([
        'the', 'is', 'in', 'at', 'of', 'a', 'an', 'and', 'or', 'to', 'for', 'on', 'with', 'that', 'this', 'it', 'as', 'be'
    ]));

    const tokenize = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(Boolean)
            .filter(token => !STOP_WORDS.current.has(token));
    };

    // Lightweight NLP: combine Jaccard overlap + keyword coverage for rough correctness scoring
    const evaluateAnswer = (userText, referenceText) => {
        const userTokensArr = tokenize(userText);
        const refTokensArr = tokenize(referenceText);

        const userTokens = new Set(userTokensArr);
        const refTokens = new Set(refTokensArr);

        if (userTokens.size === 0 || refTokens.size === 0) {
            return { score: 0, isLikelyCorrect: false, matchedKeywords: [] };
        }

        let intersection = 0;
        const matched = [];
        userTokens.forEach(token => {
            if (refTokens.has(token)) {
                intersection += 1;
                matched.push(token);
            }
        });

        const union = new Set([...userTokens, ...refTokens]).size;
        const jaccard = intersection / union;

        // Keyword coverage: unique matched keywords over reference keywords
        const coverage = matched.length / Math.max(refTokens.size, 1);

        // Final score: weighted blend to favor overlap while rewarding coverage
        const score = (jaccard * 0.7) + (coverage * 0.3);

        return {
            score,
            isLikelyCorrect: score >= 0.3, // balanced threshold
            matchedKeywords: matched.slice(0, 8),
        };
    };

    const parseTextFile = async (file) => {
        const content = await file.text();
        return content.slice(0, 15000);
    };

    const parsePdfFile = async (file) => {
        const data = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        const maxPages = Math.min(pdf.numPages, 20);
        let text = '';

        for (let i = 1; i <= maxPages; i += 1) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item) => item.str).join(' ');
            text += `${strings}\n`;
            if (text.length > 15000) break;
        }

        return text.slice(0, 15000);
    };

    const stripHtml = (html) => html.replace(/<[^>]+>/g, ' ');

    const parseDocxFile = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const text = stripHtml(result.value || '').replace(/\s+/g, ' ').trim();
        return text.slice(0, 15000);
    };

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const recognitionRef = useRef(null);
    const resumeInputRef = useRef(null);

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

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                handleSendMessage(transcript);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakText = (text) => {
        if (!isMuted && 'speechSynthesis' in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            // Select a voice if available (optional)
            // const voices = window.speechSynthesis.getVoices();
            // utterance.voice = voices[0]; 
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleChat = () => setIsOpen(!isOpen);

    const resetChat = () => {
        setMessages([
            { id: 1, text: "Hi there! I'm your SkillGPS Assistant. How can I help you today?", sender: 'bot' }
        ]);
        setInteractionMode('normal');
        setCurrentContext({ domain: null, questionIndex: null });
        setInputValue('');
        setIsTyping(false);
        setResumeText('');
    };

    const addBotMessage = (text) => {
        const newMsg = {
            id: messages.length + 1, // Be careful with this id logic, better to use prev reference inside
            text: text,
            sender: 'bot'
        };
        // Re-calculate ID safely inside setMessages
        setMessages(prev => [...prev, { ...newMsg, id: prev.length + 1 }]);

        speakText(text);
    };

    const handleResumeSelected = async (e) => {
        const file = e.target.files?.[0];
        const resetInput = () => { e.target.value = ''; };
        if (!file) return;

        const name = file.name.toLowerCase();
        const ext = name.split('.').pop();

        try {
            let content = '';

            if (ext === 'txt' || file.type === 'text/plain') {
                content = await parseTextFile(file);
            } else if (ext === 'pdf' || file.type === 'application/pdf') {
                addBotMessage('Parsing PDF resume...');
                content = await parsePdfFile(file);
            } else if (ext === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                addBotMessage('Parsing DOCX resume...');
                content = await parseDocxFile(file);
            } else {
                addBotMessage('Please upload a .txt, .pdf, or .docx resume.');
                resetInput();
                return;
            }

            if (!content || !content.trim()) {
                addBotMessage('Sorry, that file seems empty. Please try another one.');
                resetInput();
                return;
            }

            setResumeText(content);
            addBotMessage('Resume uploaded. I will keep it in mind for interview practice.');
        } catch (err) {
            console.error('Resume parse error', err);
            addBotMessage('Sorry, I could not read that file. Please try again.');
        } finally {
            resetInput();
        }
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
            if (interactionMode === 'normal' && (
                text.toLowerCase().includes('interview') ||
                text.toLowerCase().includes('question') ||
                text.toLowerCase().includes('practice') ||
                text.toLowerCase().includes('quiz') ||
                text.toLowerCase().includes('mock')
            )) {
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

                    if (resumeText) {
                        addBotMessage("I'll keep your resume context in mind while we practice.");
                    }

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
                    try {
                        const lowerText = text.toLowerCase();
                        const availableDomains = Object.keys(interviewQuestions);

                        let selectedDomain = availableDomains.find(d =>
                            lowerText.includes(d.toLowerCase())
                        );

                        // Fuzzy / Shortcut matching
                        if (!selectedDomain) {
                            if (lowerText.includes('data') || lowerText.includes('science')) selectedDomain = "Data Scientist";
                            else if (lowerText.includes('front') || lowerText.includes('web')) selectedDomain = "Frontend Developer";
                            else if (lowerText.includes('back') || lowerText.includes('api')) selectedDomain = "Backend Developer";
                            else if (lowerText.includes('ui') || lowerText.includes('ux') || lowerText.includes('design')) selectedDomain = "UI/UX Designer";
                            else if (lowerText.includes('product') || lowerText.includes('manager') || lowerText === 'pm' || lowerText.includes(' pm ')) selectedDomain = "Product Manager";
                        }

                        if (selectedDomain) {
                            const questions = interviewQuestions[selectedDomain];
                            if (!questions || questions.length === 0) {
                                throw new Error(`No questions found for ${selectedDomain}`);
                            }
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
                    } catch (err) {
                        console.error("Domain selection error:", err);
                        addBotMessage("Sorry, something went wrong selecting that domain. Please try again.");
                    } finally {
                        setIsTyping(false);
                    }
                }, 800);
                return;
            }

            // 3. Answer Question
            if (interactionMode === 'answering_question') {
                setTimeout(() => {
                    const { domain, questionIndex } = currentContext;
                    const questionObj = interviewQuestions[domain][questionIndex];

                    const referenceText = `${questionObj.answer} ${questionObj.explanation}`;
                    const { score, isLikelyCorrect, matchedKeywords } = evaluateAnswer(text, referenceText);

                    addBotMessage(`Your answer: ${text}`);

                    if (isLikelyCorrect) {
                        const keywordNote = matchedKeywords.length ? ` (matched keywords: ${matchedKeywords.join(', ')})` : '';
                        addBotMessage(`Good, keep it on! Your answer matches what I expect${keywordNote}. Can we move to the next question? (Yes/No)`);
                    } else {
                        addBotMessage("Here is an ideal answer you can compare against:");
                        addBotMessage(questionObj.answer);
                        addBotMessage(`Explanation: ${questionObj.explanation}`);
                        addBotMessage("Would you like to try another question? (Yes/No)");
                        addBotMessage(`(Tip: Cover more of these ideas — score ${Math.round(score * 100)}%)`);
                    }

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

            // 5. CAREEER ADVISOR MODE
            // Trigger
            if (interactionMode === 'normal' && (
                text.toLowerCase().includes('career advice') ||
                text.toLowerCase().includes('guide me') ||
                text.toLowerCase().includes('help me choose')
            )) {
                setTimeout(() => {
                    addBotMessage("I'd love to help you find your path! Let's start with a simple question.");
                    addBotMessage("Do you prefer working with technology/code or do you prefer design/strategy?");
                    setInteractionMode('career_advisor');
                    setCurrentContext({ step: 'start' });
                    setIsTyping(false);
                }, 800);
                return;
            }

            if (interactionMode === 'career_advisor') {
                setTimeout(() => {
                    const lowerText = text.toLowerCase();
                    const { step } = currentContext;

                    if (step === 'start') {
                        if (lowerText.includes('tech') || lowerText.includes('code')) {
                            addBotMessage("Great! In the technical realm, what interests you more?");
                            addBotMessage("1. Building visual interfaces (Websites)");
                            addBotMessage("2. Logic and data handling (Backend/APIs)");
                            addBotMessage("3. Analyzing patterns in data (Data Science)");
                            setCurrentContext({ step: 'technical' });
                        } else if (lowerText.includes('design') || lowerText.includes('strategy') || lowerText.includes('creative')) {
                            addBotMessage("Awesome! Which sounds more appealing?");
                            addBotMessage("1. Designing user interfaces and experiences (UI/UX)");
                            addBotMessage("2. Defining product strategy and roadmaps (Product Management)");
                            setCurrentContext({ step: 'creative' });
                        } else {
                            addBotMessage("I didn't quite catch that. Do you prefer 'Technology' or 'Design/Strategy'?");
                        }
                    } else if (step === 'technical') {
                        let recommendation = null;
                        if (lowerText.includes('visual') || lowerText.includes('web') || lowerText.includes('frontend')) recommendation = "Frontend Developer";
                        else if (lowerText.includes('logic') || lowerText.includes('backend') || lowerText.includes('api')) recommendation = "Backend Developer";
                        else if (lowerText.includes('data') || lowerText.includes('analyz') || lowerText.includes('science')) recommendation = "Data Scientist";

                        if (recommendation) {
                            addBotMessage(`Based on your interest, I recommend checking out **${recommendation}**.`);
                            addBotMessage("Would you like to practice some interview questions for this role?");
                            setInteractionMode('selecting_domain'); // Reuse logic!
                            addBotMessage(`Type "${recommendation}" to start practicing, or "no" to explore other options.`);
                            setInteractionMode('normal'); // Reset to normal so they can type the domain
                        } else {
                            addBotMessage("Please choose: Visual, Backend, or Data.");
                        }
                    } else if (step === 'creative') {
                        let recommendation = null;
                        if (lowerText.includes('design') || lowerText.includes('ui') || lowerText.includes('ux')) recommendation = "UI/UX Designer";
                        else if (lowerText.includes('product') || lowerText.includes('management') || lowerText.includes('strategy')) recommendation = "Product Manager";

                        if (recommendation) {
                            addBotMessage(`Based on your interest, I recommend checking out **${recommendation}**.`);
                            addBotMessage(`Type "${recommendation}" to start practicing interview questions!`);
                            setInteractionMode('normal');
                        } else {
                            addBotMessage("Please choose: Design or Product Management.");
                        }
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
            <input
                type="file"
                accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ref={resumeInputRef}
                style={{ display: 'none' }}
                onChange={handleResumeSelected}
            />
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
                                <button onClick={() => setIsMuted(!isMuted)} className="chatbot-close-btn" title={isMuted ? "Unmute Text-to-Speech" : "Mute Text-to-Speech"}>
                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                                <button onClick={resetChat} className="chatbot-close-btn" title="Start New Chat">
                                    <RefreshCw size={18} />
                                </button>
                                <button onClick={toggleChat} className="chatbot-close-btn">
                                    <X size={18} />
                                </button>
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
                                    <QuickAction text="Interview Questions" />
                                    <QuickAction text="Career advice" />
                                </div>
                            )}

                            {interactionMode === 'career_advisor' && currentContext.step === 'start' && (
                                <div style={{ padding: '0 16px 8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                    <QuickAction text="Technology / Code" />
                                    <QuickAction text="Design / Strategy" />
                                </div>
                            )}

                            {interactionMode === 'career_advisor' && currentContext.step === 'technical' && (
                                <div style={{ padding: '0 16px 8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                    <QuickAction text="Visual (Frontend)" />
                                    <QuickAction text="Logic (Backend)" />
                                    <QuickAction text="Data Science" />
                                </div>
                            )}

                            {interactionMode === 'career_advisor' && currentContext.step === 'creative' && (
                                <div style={{ padding: '0 16px 8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                    <QuickAction text="UI/UX Design" />
                                    <QuickAction text="Product Management" />
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
                                <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
                                    <button
                                        onClick={toggleListening}
                                        className={`chatbot-send-btn ${isListening ? 'listening' : ''}`}
                                        style={{ background: isListening ? '#ef4444' : 'rgba(255,255,255,0.1)' }}
                                        title="Speak"
                                    >
                                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                    </button>
                                    <button
                                        onClick={() => resumeInputRef.current?.click()}
                                        className="chatbot-upload-btn"
                                        title="Upload resume (.txt)"
                                    >
                                        <Upload size={18} />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={isListening ? "Listening..." : (interactionMode === 'answering_question' ? "Type your answer..." : "Ask anything...")}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="chatbot-input"
                                        style={{ flex: 1 }}
                                    />
                                    <button onClick={() => handleSendMessage()} className="chatbot-send-btn">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button onClick={toggleChat} className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}>
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div >
    );
};

export default Chatbot;
