import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Initialize APIs if keys are present
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

let genAI;
let openai;

if (geminiApiKey) {
    genAI = new GoogleGenerativeAI(geminiApiKey);
}

if (openaiApiKey) {
    openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true // For client-side demo purposes
    });
}

export const generateAIResponse = async (prompt, provider = 'gemini') => {
    try {
        if (provider === 'gemini') {
            if (!genAI) throw new Error("Gemini API Key missing");
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        else if (provider === 'openai') {
            if (!openai) throw new Error("OpenAI API Key missing");
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
            });
            return completion.choices[0].message.content;
        }
    } catch (error) {
        console.error("AI Error:", error);
        return `Error: ${error.message}. Please checking your API keys.`;
    }
};
