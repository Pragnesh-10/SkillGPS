/**
 * SkillGPS WebLLM Engine — Client-Side Generative AI
 *
 * Runs a small LLM entirely in the browser using WebGPU via @mlc-ai/web-llm.
 * No external API calls. The model downloads once (~900MB) and caches in the browser.
 */

import * as webllm from '@mlc-ai/web-llm';

// ─── Configuration ───────────────────────────────────────────────────
const MODEL_ID = 'SmolLM2-1.7B-Instruct-q4f16_1-MLC';

const SYSTEM_PROMPT = `You are SkillGPS Navigator, a friendly and knowledgeable AI career guidance assistant built into the SkillGPS web application.

Your expertise covers these career domains: Data Scientist, Backend Developer, Frontend Developer, UI/UX Designer, AI/ML Engineer, Product Manager, Cybersecurity Analyst, Cloud Engineer, Business Analyst, and Data Analyst.

Guidelines:
- Give practical, actionable career advice
- Recommend specific skills, tools, courses, and projects
- Use markdown formatting: headers (##), bold (**text**), bullet points, tables when useful
- Use emojis sparingly for engagement (🎯 💡 🚀 📚)
- Keep responses concise but comprehensive (150-300 words)
- Be encouraging and supportive
- When comparing careers, use tables
- Focus on the Indian tech job market when discussing salaries
- If asked something outside career guidance, politely redirect to career topics

You have deep knowledge of:
- Technical skill trees for each career
- Free and paid course recommendations (Udemy, Coursera, YouTube)
- Project ideas from beginner to advanced
- Interview preparation strategies
- Salary ranges in India (in LPA)
- Career roadmaps and learning paths
- Industry tools and frameworks`;

const INTERVIEW_SYSTEM_PROMPT = `You are a Technical Interviewer for the SkillGPS application.
You are conducting a strict but fair mock interview.
Your goal is to assess the candidate's skills, provide constructive feedback, and ask follow-up questions.

Rules:
1. ALWAYS start by evaluating the user's previous answer (if there is one). Be brief but specific about what they got right or wrong.
2. After evaluating, ALWAYS ask ONE new technical interview question related to their chosen domain.
3. Keep the entire response under 150 words.
4. If the user asks for the answer or says they don't know, provide a concise explanation and move on to a new question.
5. If the user types 'end interview' or wants to stop, offer a brief concluding remark summarizing their performance.
6. Use professional, encouraging language.`;

// ─── State ───────────────────────────────────────────────────────────
let engine = null;
let isLoading = false;
let loadError = null;

// ─── WebGPU Support Check ────────────────────────────────────────────
export const isWebGPUSupported = async () => {
    try {
        if (!navigator.gpu) return false;
        const adapter = await navigator.gpu.requestAdapter();
        return !!adapter;
    } catch {
        return false;
    }
};

// ─── Initialize Engine ──────────────────────────────────────────────
/**
 * Load the LLM model into the browser.
 * @param {Function} onProgress - Callback with { progress, text } during download
 * @returns {Promise<boolean>} - true if successfully loaded
 */
export const initEngine = async (onProgress = () => { }) => {
    if (engine) return true;
    if (isLoading) return false;

    const supported = await isWebGPUSupported();
    if (!supported) {
        loadError = 'WebGPU is not supported in your browser. Please use Chrome 113+ or Edge 113+.';
        throw new Error(loadError);
    }

    isLoading = true;
    loadError = null;

    try {
        const initProgressCallback = (report) => {
            // report.progress is 0-1, report.text is a description
            onProgress({
                progress: report.progress || 0,
                text: report.text || 'Loading model...',
            });
        };

        engine = await webllm.CreateMLCEngine(MODEL_ID, {
            initProgressCallback,
            logLevel: 'SILENT',
        });

        isLoading = false;
        return true;
    } catch (err) {
        isLoading = false;
        loadError = err.message;
        engine = null;
        throw err;
    }
};

// ─── Generate Response (Streaming) ──────────────────────────────────
/**
 * Generate a response from the LLM with streaming.
 * @param {string} userMessage - The user's message
 * @param {Array} chatHistory - Previous messages [{role, content}, ...]
 * @param {Function} onToken - Called with each new token as it streams
 * @param {AbortSignal} signal - Optional abort signal to cancel generation
 * @param {Object} contextData - Context to inject (e.g., { resumeSkills: [...], recommendedDomains: [...] })
 * @returns {Promise<string>} - The complete generated response
 */
export const generateResponse = async (userMessage, chatHistory = [], onToken = () => { }, signal = null, contextData = {}) => {
    if (!engine) throw new Error('Model not loaded');

    // Build dynamic system prompt with RAG context
    let dynamicSystemPrompt = SYSTEM_PROMPT;

    // Inject parsed resume data if available
    if (contextData?.resumeSkills?.length) {
        dynamicSystemPrompt += `\n\nUSER CONTEXT:\nThe user has uploaded their resume. They have the following technical skills: ${contextData.resumeSkills.join(', ')}.`;
        if (contextData?.experience) {
            dynamicSystemPrompt += ` They have approximately ${contextData.experience} years of experience.`;
        }
        if (contextData?.recommendedDomains?.length) {
            dynamicSystemPrompt += ` Based on their skills, we recommend these career paths: ${contextData.recommendedDomains.join(', ')}. Use this context directly when giving personalized advice.`;
        }
    }

    if (contextData?.currentDomain) {
        dynamicSystemPrompt += `\n\nThe user is currently asking about the ${contextData.currentDomain} career path. Focus your advice specifically on this domain unless they say otherwise.`;
    }

    // Build messages array
    const messages = [
        { role: 'system', content: dynamicSystemPrompt },
        ...chatHistory.slice(-6), // Keep last 6 messages for context (3 turns)
        { role: 'user', content: userMessage },
    ];

    let fullResponse = '';

    try {
        const asyncGenerator = await engine.chat.completions.create({
            messages,
            temperature: 0.7,
            max_tokens: 512,
            top_p: 0.9,
            stream: true,
        });

        for await (const chunk of asyncGenerator) {
            if (signal?.aborted) break;

            const delta = chunk.choices[0]?.delta?.content || '';
            if (delta) {
                fullResponse += delta;
                onToken(fullResponse);
            }
        }
    } catch (err) {
        if (err.name === 'AbortError' || signal?.aborted) {
            return fullResponse; // Return whatever we generated so far
        }
        throw err;
    }

    return fullResponse;
};

// ─── Generate Interview Response ────────────────────────────────────
/**
 * Generate a response specifically for the interactive AI Mock Interview mode.
 * @param {string} userMessage - The user's answer
 * @param {Array} chatHistory - Previous messages
 * @param {string} domain - The career domain being interviewed for
 * @param {Function} onToken - Streaming callback
 * @param {AbortSignal} signal - Abort signal
 */
export const generateInterviewResponse = async (userMessage, chatHistory = [], domain, onToken = () => { }, signal = null) => {
    if (!engine) throw new Error('Model not loaded');

    const dynamicInterviewPrompt = `${INTERVIEW_SYSTEM_PROMPT}\n\nThe candidate is interviewing for a ${domain} position. Ask questions appropriate for this role.`;

    const messages = [
        { role: 'system', content: dynamicInterviewPrompt },
        ...chatHistory.slice(-8), // Keep a longer context for interviews
        { role: 'user', content: userMessage },
    ];

    let fullResponse = '';

    try {
        const asyncGenerator = await engine.chat.completions.create({
            messages,
            temperature: 0.7,
            max_tokens: 400,
            top_p: 0.9,
            stream: true,
        });

        for await (const chunk of asyncGenerator) {
            if (signal?.aborted) break;

            const delta = chunk.choices[0]?.delta?.content || '';
            if (delta) {
                fullResponse += delta;
                onToken(fullResponse);
            }
        }
    } catch (err) {
        if (err.name === 'AbortError' || signal?.aborted) {
            return fullResponse;
        }
        throw err;
    }

    return fullResponse;
};

// ─── Status Helpers ─────────────────────────────────────────────────
export const isModelReady = () => !!engine;
export const isModelLoading = () => isLoading;
export const getLoadError = () => loadError;

export const resetEngine = async () => {
    if (engine) {
        try {
            await engine.resetChat();
        } catch {
            // ignore reset errors
        }
    }
};

export const unloadEngine = () => {
    engine = null;
    isLoading = false;
    loadError = null;
};
