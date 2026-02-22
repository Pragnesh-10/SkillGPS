import React, { useState, useRef, useEffect, useMemo } from 'react';
import { processMessage, getDomainFromMessage, analyzeGitHubRepos, formatGitHubAnalysis, generateICSFile, extractDomain, resetContext } from '../../services/chatbotBrain';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, X, Send, Sparkles, Cpu,
    RefreshCw, Mic, MicOff, Volume2, VolumeX, FileUp,
    Github, Calendar, Briefcase, Linkedin, Download
} from 'lucide-react';
import './Chatbot.css';
import { interviewQuestions } from '../../data/interviewQuestions';
import { careerSkills } from '../../data/careerSkills';

// ─── Lightweight Markdown Renderer ───────────────────────────────
const renderMarkdown = (text) => {
    if (!text) return '';

    // Process block-level elements first
    let html = text
        // Escape HTML
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        // Headings
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        // Horizontal rules
        .replace(/^---$/gm, '<hr/>')
        // Blockquotes
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        // Tables
        .replace(/^\|(.+)\|$/gm, (match, content) => {
            const cells = content.split('|').map(c => c.trim());
            // check if it's a separator row
            if (cells.every(c => /^[-:]+$/.test(c))) return '<!--table-sep-->';
            return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
        });

    // Wrap table rows
    html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, (match) => {
        const cleaned = match.replace(/<!--table-sep-->\n?/g, '');
        // Convert first row to th
        const firstRowDone = cleaned.replace(/<tr>(.*?)<\/tr>/, (m, inner) => {
            return `<tr>${inner.replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')}</tr>`;
        });
        return `<table>${firstRowDone}</table>`;
    });
    html = html.replace(/<!--table-sep-->\n?/g, '');

    // Unordered lists
    html = html.replace(/^[•\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Inline formatting
    html = html
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Links: [text](url)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

    // Line breaks (convert double newlines to paragraphs, single to br)
    html = html.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');

    return html;
};

// ─── NLP Helpers (for interview answer matching) ─────────────────
const STOP_WORDS = new Set([
    'the', 'is', 'in', 'at', 'of', 'a', 'an', 'and', 'or', 'to', 'for', 'on', 'with', 'that', 'this', 'it', 'as', 'be'
]);

const tokenize = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean).filter(t => !STOP_WORDS.has(t));
};

const evaluateAnswer = (userText, referenceText) => {
    const userTokens = new Set(tokenize(userText));
    const refTokens = new Set(tokenize(referenceText));
    if (userTokens.size === 0 || refTokens.size === 0) return { score: 0, isLikelyCorrect: false, matchedKeywords: [] };

    let intersection = 0;
    const matched = [];
    userTokens.forEach(token => { if (refTokens.has(token)) { intersection++; matched.push(token); } });

    const union = new Set([...userTokens, ...refTokens]).size;
    const jaccard = intersection / union;
    const coverage = matched.length / Math.max(refTokens.size, 1);
    const score = (jaccard * 0.7) + (coverage * 0.3);

    return { score, isLikelyCorrect: score >= 0.25, matchedKeywords: matched.slice(0, 8) };
};

// ─── Main Chatbot Component ─────────────────────────────────────
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [resumeText, setResumeText] = useState('');
    const [lastDomain, setLastDomain] = useState(null);
    const pdfLibRef = useRef(null);
    const mammothRef = useRef(null);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const recognitionRef = useRef(null);
    const resumeInputRef = useRef(null);

    // Interaction Modes: 'normal', 'selecting_domain', 'answering_question', 'post_answer',
    //                    'career_advisor', 'github_waiting', 'linkedin_waiting'
    const [interactionMode, setInteractionMode] = useState('normal');
    const [currentContext, setCurrentContext] = useState({ domain: null, questionIndex: null });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    // ─── Document parsers ────────────────────────────────────────
    const loadPdfJs = async () => {
        if (!pdfLibRef.current) {
            const pdfjsLib = await import('pdfjs-dist');
            const workerSrc = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc.default || workerSrc;
            pdfLibRef.current = pdfjsLib;
        }
        return pdfLibRef.current;
    };

    const loadMammoth = async () => {
        if (!mammothRef.current) {
            const mammoth = await import('mammoth/mammoth.browser');
            mammothRef.current = mammoth.default || mammoth;
        }
        return mammothRef.current;
    };

    const parseTextFile = async (file) => (await file.text()).slice(0, 15000);

    const parsePdfFile = async (file) => {
        const pdfjsLib = await loadPdfJs();
        const data = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        let text = '';
        for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
            if (text.length > 15000) break;
        }
        return text.slice(0, 15000);
    };

    const parseDocxFile = async (file) => {
        const mammoth = await loadMammoth();
        const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
        return (result.value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 15000);
    };

    // ─── Speech Recognition ──────────────────────────────────────
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
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    // ─── Open chatbot with welcome (after survey) ────────────────
    useEffect(() => {
        const handleOpenChatbotWithWelcome = (event) => {
            const { careers, fromSurvey } = event.detail || {};
            if (careers && careers.length > 0) {
                setIsOpen(true);
                setTimeout(() => {
                    if (fromSurvey) {
                        setMessages([
                            { id: 1, text: "🎉 Congratulations on completing the survey!", sender: 'bot' },
                            { id: 2, text: `Based on your responses, I've identified your top career matches: **${careers.join(', ')}**`, sender: 'bot' },
                            { id: 3, text: "I'm here to help you on your learning journey! Here's what I can do:\n\n• Practice interview questions\n• Provide career advice & guidance\n• Recommend courses & learning paths\n• Analyze your resume", sender: 'bot' },
                            { id: 4, text: "What would you like to explore first?", sender: 'bot' }
                        ]);
                        speakText("Congratulations on completing the survey! I'm here to help you on your learning journey.");
                    } else {
                        setMessages([
                            { id: 1, text: "👋 Welcome to **SkillGPS**!", sender: 'bot' },
                            { id: 2, text: `I see you're exploring all career paths! We have **${careers.length}** amazing domains available: ${careers.slice(0, 5).join(', ')}${careers.length > 5 ? `, and ${careers.length - 5} more` : ''}.`, sender: 'bot' },
                            { id: 3, text: "I can help you with courses, skills, projects, roadmaps, and interview prep. What interests you?", sender: 'bot' }
                        ]);
                        speakText("Welcome to SkillGPS! I'm here to help you discover the perfect career.");
                    }
                }, 300);
            }
        };

        window.addEventListener('openChatbotWithWelcome', handleOpenChatbotWithWelcome);
        return () => window.removeEventListener('openChatbotWithWelcome', handleOpenChatbotWithWelcome);
    }, []);

    // ─── Helpers ─────────────────────────────────────────────────
    const toggleListening = () => {
        if (isListening) { recognitionRef.current?.stop(); }
        else { recognitionRef.current?.start(); setIsListening(true); }
    };

    const speakText = (text) => {
        if (!isMuted && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_|>]/g, ''));
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleChat = () => setIsOpen(!isOpen);

    const resetChat = () => {
        setMessages([]);
        setInteractionMode('normal');
        setCurrentContext({ domain: null, questionIndex: null });
        setInputValue('');
        setIsTyping(false);
        setResumeText('');
        setLastDomain(null);
        resetContext(); // Clear NLP conversation memory
    };

    const addBotMessage = (text) => {
        setMessages(prev => [...prev, { id: prev.length + 1, text, sender: 'bot' }]);
        speakText(text);
    };

    // ─── Resume Analysis ─────────────────────────────────────────
    const analyzeResume = (content) => {
        const lower = content.toLowerCase();
        const skillPatterns = {
            programming: ['python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'typescript', 'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring'],
            data: ['sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'data analysis', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'tableau', 'power bi'],
            design: ['figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux', 'wireframing', 'prototyping', 'user research'],
            cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform'],
            other: ['git', 'agile', 'scrum', 'jira', 'api', 'rest', 'graphql', 'microservices']
        };

        const foundSkills = {};
        let totalSkillsFound = 0;
        Object.entries(skillPatterns).forEach(([category, skills]) => {
            foundSkills[category] = skills.filter(skill => lower.includes(skill.toLowerCase()));
            totalSkillsFound += foundSkills[category].length;
        });

        const expMatches = content.match(/(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*(experience|exp)/gi);
        let estimatedExperience = 0;
        if (expMatches) {
            const numbers = expMatches.map(m => parseInt(m.match(/\d+/)[0]));
            estimatedExperience = Math.max(...numbers);
        }

        const educationKeywords = ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'bca', 'mca', 'degree', 'university', 'college'];
        const hasEducation = educationKeywords.some(k => lower.includes(k));

        const recommendations = [];
        if (foundSkills.programming.some(s => ['react', 'angular', 'vue', 'javascript', 'typescript'].includes(s))) recommendations.push('Frontend Developer');
        if (foundSkills.programming.some(s => ['node.js', 'django', 'flask', 'spring', 'java', 'python'].includes(s))) recommendations.push('Backend Developer');
        if (foundSkills.data.some(s => ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'data analysis'].includes(s))) recommendations.push('Data Scientist');
        if (foundSkills.design.length > 0) recommendations.push('UI/UX Designer');

        return {
            skills: foundSkills, totalSkills: totalSkillsFound, experience: estimatedExperience,
            hasEducation, recommendations: recommendations.length > 0 ? recommendations : ['Full Stack Developer']
        };
    };

    const handleResumeSelected = async (e) => {
        const file = e.target.files?.[0];
        const resetInput = () => { e.target.value = ''; };
        if (!file) return;

        const ext = file.name.toLowerCase().split('.').pop();
        try {
            let content = '';
            if (ext === 'txt' || file.type === 'text/plain') { content = await parseTextFile(file); }
            else if (ext === 'pdf' || file.type === 'application/pdf') { addBotMessage('📄 Parsing PDF resume...'); content = await parsePdfFile(file); }
            else if (ext === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { addBotMessage('📄 Parsing DOCX resume...'); content = await parseDocxFile(file); }
            else { addBotMessage('Please upload a **.txt**, **.pdf**, or **.docx** resume.'); resetInput(); return; }

            if (!content?.trim()) { addBotMessage('Sorry, that file seems empty. Please try another one.'); resetInput(); return; }

            setResumeText(content);
            addBotMessage('✅ Resume uploaded successfully! Analyzing your profile...');

            setTimeout(() => {
                const analysis = analyzeResume(content);
                addBotMessage('## 📊 Resume Analysis Complete!\n\n' +
                    (analysis.totalSkills > 0 ? `**🔧 Skills Found:** ${Object.values(analysis.skills).flat().slice(0, 8).join(', ')}${Object.values(analysis.skills).flat().length > 8 ? ' and more' : ''}\n\n` : '**💡 Tip:** Make sure to include your technical skills!\n\n') +
                    (analysis.experience > 0 ? `**💼 Experience:** ~${analysis.experience} years\n\n` : '') +
                    (analysis.hasEducation ? '**🎓 Education:** Detected\n\n' : '') +
                    `**🎯 Recommended Careers:** ${analysis.recommendations.join(', ')}\n\nWant to explore courses, skills, or interview questions for any of these roles?`
                );
                const domainData = analysis.recommendations.map(career => ({ career, score: 0.8 }));
                localStorage.setItem('suggestedDomains', JSON.stringify(domainData));
            }, 1000);
        } catch (err) {
            console.error('Resume parse error', err);
            addBotMessage('Sorry, I could not read that file. Please try again.');
        } finally {
            resetInput();
        }
    };

    // ─── Send Message ────────────────────────────────────────────
    const handleSendMessage = async (text = inputValue) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { id: prev.length + 1, text, sender: 'user' }]);
        setInputValue('');
        setIsTyping(true);

        // Track domain context
        const detectedDomain = getDomainFromMessage(text);
        if (detectedDomain) setLastDomain(detectedDomain);

        try {
            // ─── Interview Mode ──────────────────────────────────
            if (interactionMode === 'selecting_domain') {
                setTimeout(() => {
                    const lowerText = text.toLowerCase();
                    const availableDomains = Object.keys(interviewQuestions);
                    let selectedDomain = availableDomains.find(d => lowerText.includes(d.toLowerCase()));

                    if (!selectedDomain) {
                        if (lowerText.includes('data') && lowerText.includes('scien')) selectedDomain = "Data Scientist";
                        else if (lowerText.includes('data') && lowerText.includes('analy')) selectedDomain = "Data Analyst";
                        else if (lowerText.includes('front') || (lowerText.includes('web') && !lowerText.includes('design'))) selectedDomain = "Frontend Developer";
                        else if (lowerText.includes('back') || lowerText.includes('api')) selectedDomain = "Backend Developer";
                        else if (lowerText.includes('ui') || lowerText.includes('ux') || lowerText.includes('design')) selectedDomain = "UI/UX Designer";
                        else if (lowerText.includes('product') || lowerText.includes('pm') || lowerText.includes('manager')) selectedDomain = "Product Manager";
                        else if (lowerText.includes('ml') || lowerText.includes('ai') || lowerText.includes('machine')) selectedDomain = "AI/ML Engineer";
                        else if (lowerText.includes('cyber') || lowerText.includes('security')) selectedDomain = "Cybersecurity Analyst";
                        else if (lowerText.includes('cloud') || lowerText.includes('devops')) selectedDomain = "Cloud Engineer";
                        else if (lowerText.includes('business')) selectedDomain = "Business Analyst";
                    }

                    if (selectedDomain) {
                        const questions = interviewQuestions[selectedDomain];
                        if (!questions || questions.length === 0) {
                            addBotMessage(`No questions found for ${selectedDomain}. Try another domain!`);
                            setIsTyping(false);
                            return;
                        }
                        const randomIndex = Math.floor(Math.random() * questions.length);
                        setCurrentContext({ domain: selectedDomain, questionIndex: randomIndex });
                        addBotMessage(`Great choice! Here's a **${selectedDomain}** interview question:\n\n> ${questions[randomIndex].question}\n\n*Type your answer below.*`);
                        setInteractionMode('answering_question');
                    } else {
                        addBotMessage("I didn't recognize that domain. Please choose from:\n\n" + Object.keys(interviewQuestions).map(d => `• ${d}`).join('\n'));
                    }
                    setIsTyping(false);
                }, 600);
                return;
            }

            if (interactionMode === 'answering_question') {
                setTimeout(() => {
                    const { domain, questionIndex } = currentContext;
                    const questionObj = interviewQuestions[domain][questionIndex];
                    const referenceText = `${questionObj.answer} ${questionObj.explanation}`;
                    const { score, isLikelyCorrect, matchedKeywords } = evaluateAnswer(text, referenceText);

                    if (isLikelyCorrect) {
                        const keywordNote = matchedKeywords.length ? ` You covered: **${matchedKeywords.join(', ')}**` : '';
                        addBotMessage(`🎉 **Excellent!** Your answer demonstrates solid understanding.${keywordNote}\n\nWant to try another question?`);
                    } else {
                        addBotMessage(
                            `Good effort! Your answer matched **${Math.round(score * 100)}%**.\n\n` +
                            `**✅ Expected Answer:**\n${questionObj.answer}\n\n` +
                            `**💡 Explanation:**\n${questionObj.explanation}` +
                            (matchedKeywords.length > 0 ? `\n\n✓ You mentioned: *${matchedKeywords.join(', ')}*` : '') +
                            '\n\nWant to try another question?'
                        );
                    }
                    setInteractionMode('post_answer');
                    setIsTyping(false);
                }, 800);
                return;
            }

            if (interactionMode === 'post_answer') {
                setTimeout(() => {
                    const lower = text.toLowerCase();
                    if (lower.includes('yes') || lower.includes('sure') || lower.includes('ok') || lower.includes('next') || lower.includes('another')) {
                        const questions = interviewQuestions[currentContext.domain];
                        const randomIndex = Math.floor(Math.random() * questions.length);
                        setCurrentContext(prev => ({ ...prev, questionIndex: randomIndex }));
                        addBotMessage(`Here's another **${currentContext.domain}** question:\n\n> ${questions[randomIndex].question}\n\n*Type your answer below.*`);
                        setInteractionMode('answering_question');
                    } else {
                        addBotMessage("Alright! Let me know if you want to explore anything else — courses, skills, projects, or career advice! 🚀");
                        setInteractionMode('normal');
                        setCurrentContext({ domain: null, questionIndex: null });
                    }
                    setIsTyping(false);
                }, 600);
                return;
            }

            // ─── Career Advisor Flow ─────────────────────────────
            if (interactionMode === 'career_advisor') {
                setTimeout(() => {
                    const lowerText = text.toLowerCase();
                    const { step } = currentContext;

                    if (step === 'start') {
                        if (lowerText.includes('tech') || lowerText.includes('code')) {
                            addBotMessage("In the technical realm, what interests you more?\n\n• **Visual** — Building websites & interfaces (Frontend)\n• **Logic** — Backend systems & APIs\n• **Data** — Analyzing patterns (Data Science)");
                            setCurrentContext({ step: 'technical' });
                        } else if (lowerText.includes('design') || lowerText.includes('strategy') || lowerText.includes('creative')) {
                            addBotMessage("Which sounds more appealing?\n\n• **UI/UX Design** — Crafting user interfaces\n• **Product Management** — Strategy & roadmaps");
                            setCurrentContext({ step: 'creative' });
                        } else {
                            addBotMessage("Choose one:\n• **Technology / Code**\n• **Design / Strategy**");
                        }
                    } else if (step === 'technical') {
                        let rec = null;
                        if (lowerText.includes('visual') || lowerText.includes('web') || lowerText.includes('frontend')) rec = "Frontend Developer";
                        else if (lowerText.includes('logic') || lowerText.includes('backend') || lowerText.includes('api')) rec = "Backend Developer";
                        else if (lowerText.includes('data') || lowerText.includes('analyz') || lowerText.includes('science')) rec = "Data Scientist";

                        if (rec) {
                            addBotMessage(`Based on your interest, I recommend **${rec}**! 🎯\n\nAsk me for a *roadmap*, *courses*, or *projects* for this role.`);
                            setLastDomain(rec);
                            setInteractionMode('normal');
                        } else {
                            addBotMessage("Please choose: **Visual**, **Logic**, or **Data**.");
                        }
                    } else if (step === 'creative') {
                        let rec = null;
                        if (lowerText.includes('design') || lowerText.includes('ui') || lowerText.includes('ux')) rec = "UI/UX Designer";
                        else if (lowerText.includes('product') || lowerText.includes('management') || lowerText.includes('strategy')) rec = "Product Manager";

                        if (rec) {
                            addBotMessage(`Based on your interest, I recommend **${rec}**! 🎯\n\nAsk me for a *roadmap*, *courses*, or *projects* for this role.`);
                            setLastDomain(rec);
                            setInteractionMode('normal');
                        } else {
                            addBotMessage("Please choose: **UI/UX Design** or **Product Management**.");
                        }
                    }
                    setIsTyping(false);
                }, 600);
                return;
            }

            // ─── GitHub Analysis Mode ─────────────────────────────
            if (interactionMode === 'github_waiting') {
                const input = text.trim();
                // Extract username from URL or raw text
                let username = input;
                const urlMatch = input.match(/github\.com\/([a-zA-Z0-9_-]+)/);
                if (urlMatch) username = urlMatch[1];
                username = username.replace(/[^a-zA-Z0-9_-]/g, '');

                if (!username) {
                    addBotMessage("That doesn't look like a valid GitHub username. Please try again.");
                    setIsTyping(false);
                    return;
                }

                try {
                    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
                    if (!res.ok) {
                        if (res.status === 404) {
                            addBotMessage(`❌ GitHub user **${username}** not found. Please check the username and try again.`);
                        } else if (res.status === 403) {
                            addBotMessage(`⚠️ GitHub API rate limit reached. Please try again in a few minutes.`);
                        } else {
                            addBotMessage(`❌ Could not fetch data for **${username}**. Please try again.`);
                        }
                        setIsTyping(false);
                        return;
                    }
                    const repos = await res.json();
                    if (repos.length === 0) {
                        addBotMessage(`**${username}** has no public repositories. Try a different profile!`);
                        setIsTyping(false);
                        setInteractionMode('normal');
                        return;
                    }
                    const analysis = analyzeGitHubRepos(repos);
                    const formatted = formatGitHubAnalysis(analysis, username);
                    addBotMessage(formatted);
                    if (analysis.primaryDomain) setLastDomain(analysis.primaryDomain);
                } catch (err) {
                    console.error('GitHub fetch error:', err);
                    addBotMessage("❌ Network error while fetching GitHub data. Please check your connection and try again.");
                }
                setInteractionMode('normal');
                setIsTyping(false);
                return;
            }

            // ─── LinkedIn Import Mode ────────────────────────────────
            if (interactionMode === 'linkedin_waiting') {
                // Parse pasted LinkedIn profile text
                const profileText = text.trim();
                if (profileText.length < 20) {
                    addBotMessage("That seems too short. Please paste your full LinkedIn profile text.");
                    setIsTyping(false);
                    return;
                }

                setTimeout(() => {
                    const lowerText = profileText.toLowerCase();
                    const allSkills = {};
                    const domainMatches = {};

                    Object.entries(careerSkills).forEach(([domain, skills]) => {
                        let matchCount = 0;
                        const allDomainSkills = [
                            ...(skills.technical?.essential || []),
                            ...(skills.technical?.recommended || []),
                            ...(skills.tools?.essential || []),
                        ];
                        allDomainSkills.forEach(skill => {
                            if (lowerText.includes(skill.toLowerCase())) {
                                allSkills[skill] = domain;
                                matchCount++;
                            }
                        });
                        if (matchCount > 0) domainMatches[domain] = matchCount;
                    });

                    const sortedDomains = Object.entries(domainMatches).sort((a, b) => b[1] - a[1]);
                    const foundSkills = Object.keys(allSkills);

                    if (foundSkills.length === 0) {
                        addBotMessage("I couldn't detect any career-specific skills from that text. \ud83e\udd14\n\nPlease make sure you've pasted your full LinkedIn profile, including the Skills section.\n\nOr try uploading your resume instead using the \ud83d\udcce button!");
                        setInteractionMode('normal');
                        setIsTyping(false);
                        return;
                    }

                    let response = `## \ud83d\udd17 LinkedIn Profile Analysis\n\n`;
                    response += `### \u2705 Skills Detected (${foundSkills.length})\n${foundSkills.join(', ')}\n\n`;
                    response += `### \ud83c\udfaf Career Match\n\n`;
                    response += `| Career | Match Score |\n|--------|-------------|\n`;
                    sortedDomains.slice(0, 5).forEach(([domain, count]) => {
                        const pct = Math.min(100, Math.round((count / Math.max(foundSkills.length, 1)) * 100));
                        response += `| **${domain}** | ${'\ud83d\udfe9'.repeat(Math.ceil(pct / 20))} ${pct}% |\n`;
                    });
                    response += `\n`;

                    const topDomain = sortedDomains[0]?.[0];
                    if (topDomain && careerSkills[topDomain]) {
                        const essentials = careerSkills[topDomain].technical?.essential || [];
                        const gaps = essentials.filter(s => !lowerText.includes(s.toLowerCase()));
                        if (gaps.length > 0) {
                            response += `### \u26a0\ufe0f Skill Gaps for ${topDomain}\nYou should learn: **${gaps.join(', ')}**\n\n`;
                        }
                        setLastDomain(topDomain);
                    }

                    response += `\ud83d\udca1 *Want courses or a roadmap for your top match? Just ask!*`;
                    addBotMessage(response);
                    setInteractionMode('normal');
                    setIsTyping(false);
                }, 800);
                return;
            }

            // ─── Normal Mode — Use Brain Engine ──────────────────
            // Check for career advisor trigger
            const lowerText = text.toLowerCase();
            if (lowerText.includes('career advice') || lowerText.includes('guide me') || lowerText.includes('help me choose')) {
                setTimeout(() => {
                    addBotMessage("I'd love to help you find your path! 🧭\n\nDo you prefer:\n• **Technology / Code**\n• **Design / Strategy**");
                    setInteractionMode('career_advisor');
                    setCurrentContext({ step: 'start' });
                    setIsTyping(false);
                }, 500);
                return;
            }

            // Process with NLP Brain
            setTimeout(async () => {
                const response = processMessage(text, { lastDomain, resumeText });

                // Check if brain wants to trigger interview mode
                if (response === '__TRIGGER_INTERVIEW_MODE__') {
                    const savedDomains = localStorage.getItem('suggestedDomains');
                    let domains = [];
                    if (savedDomains) {
                        try { domains = JSON.parse(savedDomains).map(d => d.career); } catch (e) { /* ignore */ }
                    }
                    if (domains.length === 0) domains = Object.keys(interviewQuestions);

                    addBotMessage("Let's practice some interview questions! 🎤\n\nWhich domain would you like?\n\n" + domains.map(d => `• ${d}`).join('\n'));
                    setInteractionMode('selecting_domain');
                } else if (response === '__TRIGGER_GITHUB_ANALYSIS__') {
                    addBotMessage("I'd love to analyze your GitHub portfolio! 🐙\n\nPlease paste your **GitHub username** or **profile URL** below:\n\n*Example: `octocat` or `https://github.com/octocat`*");
                    setInteractionMode('github_waiting');
                } else if (response === '__TRIGGER_LINKEDIN_IMPORT__') {
                    addBotMessage("Great! I can analyze your LinkedIn profile to suggest career paths! 🔗\n\n**How to share your data:**\n1. Go to your LinkedIn profile\n2. Select all text (Ctrl+A / Cmd+A)\n3. Copy and paste it here\n\nOr upload your **LinkedIn PDF export** using the 📎 button.\n\n*Your data stays local — nothing is sent to any server.*");
                    setInteractionMode('linkedin_waiting');
                } else if (response.startsWith('__TRIGGER_CALENDAR_DOWNLOAD__')) {
                    const calDomain = response.replace('__TRIGGER_CALENDAR_DOWNLOAD__', '').trim() || lastDomain;
                    if (calDomain) {
                        const icsContent = generateICSFile(calDomain);
                        if (icsContent) {
                            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `SkillGPS_${calDomain.replace(/[\s/]/g, '_')}_Study_Plan.ics`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            addBotMessage(`✅ **Calendar downloaded!**\n\nYour **${calDomain}** 8-week study plan has been saved as an .ics file.\n\n**Import instructions:**\n• **Google Calendar:** Settings → Import & Export → Import\n• **Apple Calendar:** File → Import\n• **Outlook:** File → Open & Export → Import\n\n📅 Your plan starts next Monday with 5 sessions/week, 2 hours each.`);
                        } else {
                            addBotMessage(`I don't have enough data to create a schedule for that domain. Try a specific career like "download calendar data science".`);
                        }
                    } else {
                        addBotMessage(`Which career should I create a calendar for?\n\nSay: **"download calendar data science"** or **"download calendar backend"**`);
                    }
                } else {
                    addBotMessage(response);
                }
                setIsTyping(false);
            }, 400 + Math.random() * 600);

        } catch (error) {
            addBotMessage("Sorry, I encountered an error. Please try again.");
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    // ─── Chat Export ─────────────────────────────────────────────
    const exportChat = () => {
        if (messages.length === 0) return;

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const messagesHtml = messages.map(m => {
            const rendered = renderMarkdown(m.text);
            const isUser = m.sender === 'user';
            return `
                <div style="display:flex;gap:12px;align-items:flex-start;margin:12px 0;${isUser ? 'flex-direction:row-reverse;' : ''}">
                    <div style="min-width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;
                        background:${isUser ? 'linear-gradient(135deg,#FF9933,#e88a2e)' : 'linear-gradient(135deg,rgba(255,153,51,0.15),rgba(19,136,8,0.15))'};">
                        ${isUser ? '👤' : '🤖'}
                    </div>
                    <div style="max-width:80%;padding:12px 16px;border-radius:16px;line-height:1.7;font-size:14px;
                        ${isUser ? 'background:#FF9933;color:white;border-bottom-right-radius:4px;' :
                    'background:#f8f9fa;color:#1a1a2e;border:1px solid #e9ecef;border-bottom-left-radius:4px;'}">
                        ${rendered}
                    </div>
                </div>`;
        }).join('');

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>SkillGPS Chat — ${dateStr}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#fff;color:#1a1a2e;padding:40px;max-width:800px;margin:0 auto}
  h1{font-size:24px;margin-bottom:4px}
  .meta{color:#666;font-size:13px;margin-bottom:24px}
  table{width:100%;border-collapse:collapse;margin:10px 0;font-size:13px}
  th{background:#f0f0f0;padding:8px 10px;text-align:left;font-weight:600;border-bottom:2px solid #ddd}
  td{padding:6px 10px;border-bottom:1px solid #eee}
  h2,h3{color:#FF9933;margin:10px 0 6px;font-size:16px}
  strong{color:#c97a20}
  code{background:#f4f4f4;padding:2px 6px;border-radius:4px;font-size:12px}
  a{color:#FF9933}
  blockquote{border-left:3px solid #FF9933;padding-left:12px;color:#666;margin:8px 0}
  hr{border:none;border-top:1px solid #eee;margin:16px 0}
  ul,ol{padding-left:20px;margin:6px 0}
  .footer{text-align:center;margin-top:40px;color:#999;font-size:12px;border-top:1px solid #eee;padding-top:16px}
</style></head><body>
<h1>🧭 SkillGPS — Chat Export</h1>
<div class="meta">Exported on ${dateStr} at ${timeStr}</div>
${messagesHtml}
<div class="footer">Exported from SkillGPS AI Navigator — skillgps.vercel.app</div>
</body></html>`;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SkillGPS_Chat_${now.toISOString().slice(0, 10)}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // ─── Welcome Suggestions ────────────────────────────────────
    const welcomeSuggestions = useMemo(() => [
        { icon: '🗺️', text: 'How to become a Data Scientist?' },
        { icon: '📚', text: 'Recommend courses for Backend' },
        { icon: '🐙', text: 'Analyze my GitHub profile' },
        { icon: '💼', text: 'Find jobs for AI/ML' },
        { icon: '📅', text: 'Schedule a study plan' },
        { icon: '💰', text: 'Compare salary across careers' },
    ], []);

    // ─── Render ──────────────────────────────────────────────────
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
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Header */}
                        <div className="chatbot-header">
                            <div className="chatbot-title">
                                <Sparkles size={18} />
                                <span>SkillGPS AI</span>
                                <span className="chatbot-title-badge">Smart</span>
                            </div>
                            <div className="chatbot-header-actions">
                                <button onClick={() => setIsMuted(!isMuted)} className="chatbot-close-btn" title={isMuted ? "Unmute" : "Mute"}>
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <button onClick={() => resumeInputRef.current?.click()} className="chatbot-close-btn" title="Upload Resume">
                                    <FileUp size={16} />
                                </button>
                                <button onClick={exportChat} className="chatbot-close-btn" title="Export Chat" disabled={messages.length === 0}>
                                    <Download size={16} />
                                </button>
                                <button onClick={resetChat} className="chatbot-close-btn" title="New Chat">
                                    <RefreshCw size={16} />
                                </button>
                                <button onClick={toggleChat} className="chatbot-close-btn" title="Close">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages or Welcome */}
                        {messages.length === 0 ? (
                            <div className="chatbot-welcome">
                                <div className="welcome-icon">
                                    <Cpu size={28} />
                                </div>
                                <div className="welcome-title">SkillGPS Navigator</div>
                                <div className="welcome-subtitle">
                                    Your AI-powered career guide. Ask about skills, courses, projects, roadmaps, salaries, and more.
                                </div>
                                <div className="welcome-suggestions">
                                    {welcomeSuggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            className="welcome-suggestion-btn"
                                            onClick={() => handleSendMessage(s.text)}
                                        >
                                            <span className="suggestion-icon">{s.icon}</span>
                                            <span>{s.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="chatbot-messages">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {msg.sender === 'bot' && (
                                            <div className="bot-avatar">
                                                <Sparkles />
                                            </div>
                                        )}
                                        <div className={`message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                                            {msg.sender === 'bot' ? (
                                                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                                            ) : (
                                                msg.text
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <div className="message-row bot-row">
                                        <div className="bot-avatar"><Sparkles /></div>
                                        <div className="message message-bot">
                                            <div className="typing-indicator">
                                                <div className="typing-dot"></div>
                                                <div className="typing-dot"></div>
                                                <div className="typing-dot"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        {/* Quick Actions */}
                        {messages.length > 0 && messages.length < 4 && interactionMode === 'normal' && (
                            <div className="chatbot-quick-actions">
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Recommend a course")}>📚 Courses</button>
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Interview Questions")}>🎤 Interview</button>
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Career advice")}>🧭 Career Guide</button>
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Compare salaries")}>💰 Salaries</button>
                            </div>
                        )}

                        {interactionMode === 'career_advisor' && currentContext.step === 'start' && (
                            <div className="chatbot-quick-actions">
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Technology / Code")}>💻 Technology</button>
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Design / Strategy")}>🎨 Design</button>
                            </div>
                        )}

                        {interactionMode === 'career_advisor' && currentContext.step === 'technical' && (
                            <div className="chatbot-quick-actions">
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Visual (Frontend)")}>🌐 Frontend</button>
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Logic (Backend)")}>⚙️ Backend</button>
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Data Science")}>📊 Data Science</button>
                            </div>
                        )}

                        {interactionMode === 'career_advisor' && currentContext.step === 'creative' && (
                            <div className="chatbot-quick-actions">
                                <button className="quick-action-btn" onClick={() => handleSendMessage("UI/UX Design")}>🎨 UI/UX</button>
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Product Management")}>📋 Product</button>
                            </div>
                        )}

                        {interactionMode === 'selecting_domain' && (
                            <div className="chatbot-quick-actions">
                                {(() => {
                                    const saved = localStorage.getItem('suggestedDomains');
                                    let domains = saved ? JSON.parse(saved).map(d => d.career) : Object.keys(interviewQuestions);
                                    if (domains.length === 0) domains = Object.keys(interviewQuestions);
                                    return domains.slice(0, 5).map(d => (
                                        <button key={d} className="quick-action-btn" onClick={() => handleSendMessage(d)}>{d}</button>
                                    ));
                                })()}
                            </div>
                        )}

                        {interactionMode === 'post_answer' && (
                            <div className="chatbot-quick-actions">
                                <button className="quick-action-btn" onClick={() => handleSendMessage("Yes, next question")}>✅ Next Question</button>
                                <button className="quick-action-btn" onClick={() => handleSendMessage("No, thanks")}>❌ Done</button>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="chatbot-input-area">
                            <div className="chatbot-input-row">
                                <button
                                    onClick={toggleListening}
                                    className={`chatbot-mic-btn ${isListening ? 'listening' : ''}`}
                                    title={isListening ? "Stop listening" : "Speak"}
                                >
                                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                                </button>
                                <input
                                    type="text"
                                    placeholder={isListening ? "Listening..." : (interactionMode === 'answering_question' ? "Type your answer..." : "Ask me anything...")}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="chatbot-input"
                                />
                                <button onClick={() => handleSendMessage()} className="chatbot-send-btn" title="Send">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="chatbot-footer">BUILT WITH ❤️ BY SKILLGPS</div>
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
