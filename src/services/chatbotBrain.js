/**
 * SkillGPS Chatbot Brain — Fully Client-Side AI Engine
 * 
 * A sophisticated NLP engine that uses intent classification, entity extraction,
 * keyword matching, and contextual awareness to provide intelligent career
 * guidance responses. No external APIs are used.
 */

import { careerSkills, getEssentialSkills } from '../data/careerSkills';
import { courses, getAllDomains } from '../data/courses';
import { careerProjects } from '../data/careerProjects';

// ─── Constants ────────────────────────────────────────────────────────
const DOMAINS = getAllDomains();

const STOP_WORDS = new Set([
    'the', 'is', 'in', 'at', 'of', 'a', 'an', 'and', 'or', 'to', 'for',
    'on', 'with', 'that', 'this', 'it', 'as', 'be', 'are', 'was', 'were',
    'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'i', 'me', 'my', 'we', 'our',
    'you', 'your', 'he', 'she', 'they', 'them', 'its', 'but', 'not', 'no',
    'so', 'if', 'then', 'than', 'too', 'very', 'just', 'about', 'what',
    'which', 'who', 'whom', 'how', 'when', 'where', 'why', 'all', 'each',
    'some', 'any', 'few', 'more', 'most', 'other', 'into', 'own', 'same',
    'up', 'out', 'also', 'get', 'got', 'need', 'want', 'please', 'tell',
    'know', 'let', 'give', 'show', 'help', 'hi', 'hey', 'hello',
]);

// ─── Intent Definitions ──────────────────────────────────────────────
const INTENTS = [
    {
        name: 'greeting',
        patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy', 'greetings', 'sup', 'yo', 'namaste'],
        priority: 1,
    },
    {
        name: 'farewell',
        patterns: ['bye', 'goodbye', 'see you', 'take care', 'later', 'cya', 'good night', 'thanks bye'],
        priority: 1,
    },
    {
        name: 'thanks',
        patterns: ['thanks', 'thank you', 'thx', 'appreciate', 'grateful', 'awesome thanks', 'great thanks'],
        priority: 1,
    },
    {
        name: 'course_recommendation',
        patterns: ['course', 'courses', 'recommend course', 'learn', 'learning path', 'study', 'tutorial', 'training', 'certification', 'where to learn', 'best course', 'free course', 'paid course', 'online course', 'how to learn', 'resources', 'material', 'study material', 'beginner course', 'advanced course'],
        priority: 3,
    },
    {
        name: 'skill_inquiry',
        patterns: ['skills', 'what skills', 'skill needed', 'required skills', 'skill gap', 'technical skills', 'soft skills', 'tools needed', 'what should i learn', 'prerequisites', 'requirements'],
        priority: 3,
    },
    {
        name: 'project_suggestion',
        patterns: ['project', 'projects', 'project ideas', 'portfolio', 'build', 'create', 'hands on', 'practical', 'practice project', 'side project', 'beginner project', 'advanced project'],
        priority: 3,
    },
    {
        name: 'career_info',
        patterns: ['career', 'career path', 'job', 'role', 'profession', 'what does', 'salary', 'job market', 'demand', 'future', 'scope', 'opportunities', 'career options', 'career change', 'switch career'],
        priority: 2,
    },
    {
        name: 'interview_prep',
        patterns: ['interview', 'interview question', 'practice', 'mock', 'quiz', 'prepare', 'preparation', 'interview tips', 'common questions'],
        priority: 3,
    },
    {
        name: 'comparison',
        patterns: ['difference', 'compare', 'vs', 'versus', 'better', 'which one', 'or', 'comparison', 'pros and cons', 'advantages'],
        priority: 2,
    },
    {
        name: 'motivation',
        patterns: ['motivate', 'inspiration', 'stuck', 'frustrated', 'confused', 'lost', 'overwhelmed', 'scared', 'nervous', 'anxious', 'worried', 'unmotivated', 'burnout', 'imposter', 'fail', 'failure', 'give up', 'difficulty', 'hard'],
        priority: 2,
    },
    {
        name: 'about_bot',
        patterns: ['who are you', 'what can you do', 'what are you', 'your name', 'about you', 'capabilities', 'features', 'how do you work'],
        priority: 1,
    },
    {
        name: 'roadmap',
        patterns: ['roadmap', 'path', 'plan', 'journey', 'timeline', 'step by step', 'how to become', 'guide', 'how to start', 'where to start', 'getting started', 'beginner', 'start from scratch'],
        priority: 3,
    },
    {
        name: 'salary_info',
        patterns: ['salary', 'pay', 'compensation', 'earning', 'income', 'how much', 'ctc', 'package', 'money'],
        priority: 2,
    },
    {
        name: 'tool_inquiry',
        patterns: ['tool', 'tools', 'software', 'ide', 'editor', 'platform', 'framework', 'library', 'technology', 'tech stack'],
        priority: 2,
    },
    {
        name: 'github_analysis',
        patterns: ['github', 'analyze github', 'github profile', 'github portfolio', 'my repos', 'my repositories', 'analyze my github', 'github url', 'github username'],
        priority: 3,
    },
    {
        name: 'linkedin_import',
        patterns: ['linkedin', 'linkedin profile', 'import linkedin', 'linkedin data', 'linkedin skills', 'linkedin import'],
        priority: 3,
    },
    {
        name: 'calendar_schedule',
        patterns: ['schedule', 'calendar', 'study plan', 'study schedule', 'google calendar', 'ics', 'plan my study', 'create schedule', 'time table', 'timetable', 'weekly plan'],
        priority: 3,
    },
    {
        name: 'job_search',
        patterns: ['job', 'jobs', 'job listing', 'job search', 'find jobs', 'openings', 'vacancies', 'hiring', 'apply', 'job portal', 'naukri', 'indeed', 'glassdoor', 'job board'],
        priority: 3,
    },
];

// ─── Tokenization ────────────────────────────────────────────────────
const tokenize = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s/]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
};

const tokenizeClean = (text) => {
    return tokenize(text).filter(t => !STOP_WORDS.has(t));
};

// ─── Entity Extraction ──────────────────────────────────────────────
const DOMAIN_ALIASES = {
    'data science': 'Data Scientist',
    'data scientist': 'Data Scientist',
    'ds': 'Data Scientist',
    'ml': 'AI/ML Engineer',
    'machine learning': 'AI/ML Engineer',
    'ai': 'AI/ML Engineer',
    'artificial intelligence': 'AI/ML Engineer',
    'ai/ml': 'AI/ML Engineer',
    'ai ml': 'AI/ML Engineer',
    'backend': 'Backend Developer',
    'back end': 'Backend Developer',
    'back-end': 'Backend Developer',
    'backend developer': 'Backend Developer',
    'backend dev': 'Backend Developer',
    'server side': 'Backend Developer',
    'frontend': 'Frontend Developer',
    'front end': 'Frontend Developer',
    'front-end': 'Frontend Developer',
    'frontend developer': 'Frontend Developer',
    'frontend dev': 'Frontend Developer',
    'web developer': 'Frontend Developer',
    'web dev': 'Frontend Developer',
    'ui ux': 'UI/UX Designer',
    'ui/ux': 'UI/UX Designer',
    'ux': 'UI/UX Designer',
    'ui': 'UI/UX Designer',
    'designer': 'UI/UX Designer',
    'ux designer': 'UI/UX Designer',
    'product manager': 'Product Manager',
    'pm': 'Product Manager',
    'product management': 'Product Manager',
    'cybersecurity': 'Cybersecurity Analyst',
    'cyber security': 'Cybersecurity Analyst',
    'security': 'Cybersecurity Analyst',
    'infosec': 'Cybersecurity Analyst',
    'cloud': 'Cloud Engineer',
    'cloud engineer': 'Cloud Engineer',
    'cloud computing': 'Cloud Engineer',
    'devops': 'Cloud Engineer',
    'business analyst': 'Business Analyst',
    'ba': 'Business Analyst',
    'business analysis': 'Business Analyst',
    'data analyst': 'Data Analyst',
    'data analysis': 'Data Analyst',
    'analytics': 'Data Analyst',
};

const extractDomain = (text) => {
    const lower = text.toLowerCase();
    // Check multi-word aliases first (longest match)
    const sorted = Object.entries(DOMAIN_ALIASES).sort((a, b) => b[0].length - a[0].length);
    for (const [alias, domain] of sorted) {
        if (lower.includes(alias)) return domain;
    }
    // Fallback: check DOMAINS list
    for (const d of DOMAINS) {
        if (lower.includes(d.toLowerCase())) return d;
    }
    return null;
};

const extractLevel = (text) => {
    const lower = text.toLowerCase();
    if (/\b(beginner|basics?|start|entry|junior|newbie|freshman|novice)\b/.test(lower)) return 'beginner';
    if (/\b(intermediate|mid|middle|some experience)\b/.test(lower)) return 'intermediate';
    if (/\b(advanced|senior|expert|experienced|pro|master)\b/.test(lower)) return 'advanced';
    return null;
};

// ─── Intent Classification ──────────────────────────────────────────
const classifyIntent = (text) => {
    const lower = text.toLowerCase();
    const tokens = tokenize(lower);

    let bestIntent = null;
    let bestScore = 0;

    for (const intent of INTENTS) {
        let score = 0;
        for (const pattern of intent.patterns) {
            const patternTokens = pattern.split(' ');
            if (patternTokens.length > 1) {
                // Multi-word pattern: check if the phrase exists in text
                if (lower.includes(pattern)) {
                    score += pattern.length * 2;
                }
            } else {
                // Single word: check token match
                if (tokens.includes(pattern)) {
                    score += pattern.length;
                }
            }
        }
        // Weighted by priority
        score *= intent.priority;

        if (score > bestScore) {
            bestScore = score;
            bestIntent = intent.name;
        }
    }

    return bestScore > 0 ? bestIntent : 'general';
};

// ─── Response Generators ─────────────────────────────────────────────

const greetingResponses = [
    "Hey there! 👋 I'm your **SkillGPS Career Navigator**. I can help you with:\n\n• 📚 Course recommendations for any career\n• 🛠️ Skills you need to master\n• 💡 Project ideas to build your portfolio\n• 🎯 Career roadmaps & guidance\n• 🎤 Interview preparation\n\nWhat career are you interested in?",
    "Hello! 🎉 Welcome to **SkillGPS**! I'm here to guide your career journey.\n\nTry asking me things like:\n• *\"What skills do I need for Data Science?\"*\n• *\"Recommend courses for Backend Development\"*\n• *\"Project ideas for AI/ML\"*\n• *\"How to become a UI/UX Designer?\"*\n\nWhat would you like to explore?",
    "Namaste! 🙏 I'm your **AI Career Assistant**. Think of me as your personal career GPS!\n\nI have deep knowledge about **9 career domains** including Data Science, Backend Development, AI/ML, UI/UX Design, and more.\n\nWhat's on your mind today?",
];

const farewellResponses = [
    "Goodbye! 👋 Best of luck on your career journey. Remember — every expert was once a beginner! Come back anytime.",
    "See you later! 🚀 Keep learning, keep growing. I'm always here when you need guidance!",
    "Take care! 💪 Remember to check your dashboard for personalized learning paths. See you soon!",
];

const thanksResponses = [
    "You're welcome! 😊 Feel free to ask me anything else — I'm here to help!",
    "Happy to help! 🎯 If you have more questions about careers, skills, or courses, just ask!",
    "Glad I could assist! 💡 Keep exploring and learning. You're on the right track!",
];

const motivationResponses = [
    "I totally understand that feeling. 💪 Here's what I want you to remember:\n\n> *\"Every expert was once a beginner.\"*\n\nThe tech industry is vast, but you don't need to learn everything at once. Pick **one skill**, give it 30 minutes a day, and you'll be amazed at your progress in a month.\n\nWant me to suggest a beginner-friendly learning path?",
    "It's completely normal to feel that way — even senior developers feel it sometimes. It's called **Imposter Syndrome**, and it means you care about doing well! 🌟\n\nHere's a practical tip: **Build one small project.** Seeing something work that YOU created is the best motivation.\n\nWant me to suggest a project idea for your interest area?",
    "Hey, everyone struggles at some point. Here's the thing — the fact that you're here, asking questions and trying to learn, already puts you ahead of most people! 🚀\n\n**3 tips to stay motivated:**\n1. Set tiny daily goals (15-30 min of learning)\n2. Join a community (Discord, Reddit, Twitter)\n3. Track your progress — celebrate small wins!\n\nWhich career domain interests you? I'll create a manageable plan for you.",
];

const aboutBotResponses = [
    "I'm **SkillGPS Navigator** — a fully self-contained AI career assistant! 🤖\n\nI was built right into this application with deep knowledge about:\n\n• **9 career domains** with detailed skill trees\n• **200+ curated courses** (free & paid)\n• **80+ project ideas** across all levels\n• **250+ interview questions** with answers\n• **Career roadmaps** from beginner to advanced\n\nI don't need any internet connection to help you — my brain is built into the app! Try asking me about any career path.",
];

const generateCourseResponse = (domain, level) => {
    const domainCourses = courses[domain] || courses['default'];
    if (!domainCourses) {
        return `I don't have specific courses for that domain yet. Check the **Dashboard** for general recommendations!`;
    }

    const formatCourseTable = (courseList, heading) => {
        const free = courseList.filter(c => c.type === 'free');
        const paid = courseList.filter(c => c.type === 'paid');
        let result = `### ${heading}\n\n`;

        if (free.length > 0) {
            result += `**🆓 Free Resources**\n\n`;
            result += `| Course | Platform | Duration | Rating |\n|--------|----------|----------|--------|\n`;
            result += free.map(c => `| **${c.title}** | ${c.platform} | ${c.duration} | ⭐ ${c.rating} |`).join('\n');
            result += `\n\n`;
        }

        if (paid.length > 0) {
            result += `**💰 Premium Courses**\n\n`;
            result += `| Course | Platform | Duration | Rating | Outcome |\n|--------|----------|----------|--------|---------|\n`;
            result += paid.map(c => `| **${c.title}** | ${c.platform} | ${c.duration} | ⭐ ${c.rating} | ${c.outcome} |`).join('\n');
            result += `\n\n`;
        }

        return result;
    };

    if (level && domainCourses[level]) {
        const courseList = domainCourses[level];
        const cap = level.charAt(0).toUpperCase() + level.slice(1);
        let response = `## 📚 ${cap} Courses for ${domain}\n\n`;
        response += formatCourseTable(courseList, `${cap} Level`);
        response += `💡 *Want to see ${level === 'beginner' ? 'intermediate' : level === 'intermediate' ? 'advanced' : 'beginner'} courses too? Just ask!*`;
        return response;
    }

    // Show overview of all levels
    const levels = ['beginner', 'intermediate', 'advanced'];
    let response = `## 📚 Learning Path for ${domain}\n\n`;
    response += `| Level | Free | Paid | Total |\n|-------|------|------|-------|\n`;
    response += levels.map(lvl => {
        const list = domainCourses[lvl] || [];
        const freeCount = list.filter(c => c.type === 'free').length;
        const paidCount = list.filter(c => c.type === 'paid').length;
        return `| **${lvl.charAt(0).toUpperCase() + lvl.slice(1)}** | 🆓 ${freeCount} | 💰 ${paidCount} | ${list.length} |`;
    }).join('\n');

    // Show top free pick from each level
    response += `\n\n### 🌟 Top Free Picks\n\n`;
    levels.forEach(lvl => {
        const list = domainCourses[lvl] || [];
        const topFree = list.find(c => c.type === 'free');
        if (topFree) {
            response += `**${lvl.charAt(0).toUpperCase() + lvl.slice(1)}:** ${topFree.title} — *${topFree.platform}* (⭐ ${topFree.rating})\n`;
        }
    });

    response += `\n📌 *Say "beginner courses for ${domain}" or "advanced courses" to see the full list with details!*`;
    return response;
};

const generateSkillResponse = (domain) => {
    const skills = careerSkills[domain];
    if (!skills) {
        return `I don't have detailed skill data for that domain. Try asking about: ${DOMAINS.join(', ')}.`;
    }

    const essential = skills.technical?.essential || [];
    const recommended = skills.technical?.recommended || [];
    const advanced = skills.technical?.advanced || [];
    const toolsEssential = skills.tools?.essential || [];
    const toolsRecommended = skills.tools?.recommended || [];
    const toolsAdvanced = skills.tools?.advanced || [];
    const soft = skills.soft || [];

    let response = `## 🛠️ Skills for ${domain}\n\n`;

    // Technical skills table
    response += `### Technical Skills\n\n`;
    response += `| Priority | Skills |\n|----------|--------|\n`;
    response += `| 🟢 **Essential** | ${essential.join(', ')} |\n`;
    response += `| 🔵 **Recommended** | ${recommended.join(', ')} |\n`;
    response += `| 🟣 **Advanced** | ${advanced.join(', ')} |\n\n`;

    // Tools table
    response += `### Tools & Software\n\n`;
    response += `| Priority | Tools |\n|----------|-------|\n`;
    if (toolsEssential.length) response += `| 🟢 **Must-Have** | ${toolsEssential.join(', ')} |\n`;
    if (toolsRecommended.length) response += `| 🔵 **Recommended** | ${toolsRecommended.join(', ')} |\n`;
    if (toolsAdvanced.length) response += `| 🟣 **Advanced** | ${toolsAdvanced.join(', ')} |\n`;
    response += `\n`;

    // Soft skills
    response += `### 🤝 Soft Skills\n${soft.join(' • ')}\n\n`;

    // Summary stats
    const total = essential.length + recommended.length + advanced.length;
    response += `📊 **Total:** ${total} technical skills, ${toolsEssential.length + toolsRecommended.length + toolsAdvanced.length} tools, ${soft.length} soft skills\n\n`;
    response += `💡 *Want course recommendations to learn these skills? Just ask!*`;
    return response;
};

const generateProjectResponse = (domain, level) => {
    const projects = careerProjects[domain];
    if (!projects) {
        return `I don't have project ideas for that specific domain yet. Try: ${Object.keys(careerProjects).join(', ')}.`;
    }

    const targetLevel = level || 'beginner';
    const projectList = projects[targetLevel];
    if (!projectList || projectList.length === 0) {
        return `No ${targetLevel}-level projects available for ${domain} right now. Try a different level!`;
    }

    const cap = targetLevel.charAt(0).toUpperCase() + targetLevel.slice(1);

    // Overview table
    const allLevels = ['beginner', 'intermediate', 'advanced'];
    let response = `## 💡 ${cap} Projects for ${domain}\n\n`;
    response += `### Quick Overview\n\n`;
    response += `| Level | Available Projects |\n|-------|--------------------|\n`;
    allLevels.forEach(lvl => {
        const list = projects[lvl] || [];
        const marker = lvl === targetLevel ? ' 👈' : '';
        response += `| ${lvl.charAt(0).toUpperCase() + lvl.slice(1)} | ${list.length} projects${marker} |\n`;
    });
    response += `\n`;

    // Detailed project cards
    const selected = projectList.slice(0, 3);
    selected.forEach((p, i) => {
        response += `---\n\n`;
        response += `### ${i + 1}. ${p.title}\n\n`;
        response += `${p.description}\n\n`;
        response += `| Detail | Info |\n|--------|------|\n`;
        response += `| **🛠️ Skills** | ${p.skills.join(', ')} |\n`;
        response += `| **⏱️ Duration** | ${p.duration} |\n`;
        response += `| **📋 Outcomes** | ${p.outcomes.join(', ')} |\n\n`;
    });

    const remaining = projectList.length - 3;
    if (remaining > 0) response += `*+ ${remaining} more ${targetLevel} projects available!*\n\n`;
    response += `🚀 *Want ${targetLevel === 'beginner' ? 'intermediate or advanced' : targetLevel === 'intermediate' ? 'beginner or advanced' : 'beginner or intermediate'} projects? Just ask!*`;
    return response;
};

const generateRoadmapResponse = (domain) => {
    const skills = careerSkills[domain];
    const domainCourses = courses[domain] || courses['default'];
    const domainProjects = careerProjects[domain];

    if (!skills) {
        return `I'd love to create a roadmap for you! Which career interests you most?\n\nAvailable domains: ${DOMAINS.join(', ')}`;
    }

    const essentialSkills = skills.technical?.essential?.slice(0, 5).join(', ') || 'Core fundamentals';
    const recSkills = skills.technical?.recommended?.slice(0, 4).join(', ') || 'Framework-specific skills';
    const advSkills = skills.technical?.advanced?.slice(0, 3).join(', ') || 'Specialized topics';

    // Pull real course names
    const beginnerCourse = domainCourses?.beginner?.find(c => c.type === 'free');
    const intermediateCourse = domainCourses?.intermediate?.find(c => c.type === 'free') || domainCourses?.intermediate?.[0];
    const advancedCourse = domainCourses?.advanced?.[0];

    // Pull real project names
    const beginnerProject = domainProjects?.beginner?.[0];
    const intermediateProject = domainProjects?.intermediate?.[0];
    const advancedProject = domainProjects?.advanced?.[0];

    let response = `## 🗺️ ${domain} — Complete Roadmap\n\n`;

    // Phase 1
    response += `### Phase 1: Foundation (Month 1-2)\n\n`;
    response += `| Area | Details |\n|------|---------|\n`;
    response += `| **🎯 Learn** | ${essentialSkills} |\n`;
    if (beginnerCourse) response += `| **📚 Course** | ${beginnerCourse.title} — *${beginnerCourse.platform}* (⭐ ${beginnerCourse.rating}) |\n`;
    if (beginnerProject) response += `| **💡 Project** | ${beginnerProject.title} — ${beginnerProject.duration} |\n`;
    if (skills.tools?.essential) response += `| **🔧 Tools** | ${skills.tools.essential.slice(0, 4).join(', ')} |\n`;
    response += `\n`;

    // Phase 2
    response += `### Phase 2: Build Skills (Month 3-4)\n\n`;
    response += `| Area | Details |\n|------|---------|\n`;
    response += `| **🎯 Learn** | ${recSkills} |\n`;
    if (intermediateCourse) response += `| **📚 Course** | ${intermediateCourse.title} — *${intermediateCourse.platform}* (⭐ ${intermediateCourse.rating}) |\n`;
    if (intermediateProject) response += `| **💡 Project** | ${intermediateProject.title} — ${intermediateProject.duration} |\n`;
    if (skills.tools?.recommended) response += `| **🔧 Tools** | ${skills.tools.recommended.slice(0, 4).join(', ')} |\n`;
    response += `\n`;

    // Phase 3
    response += `### Phase 3: Specialize (Month 5-6)\n\n`;
    response += `| Area | Details |\n|------|---------|\n`;
    response += `| **🎯 Learn** | ${advSkills} |\n`;
    if (advancedCourse) response += `| **📚 Course** | ${advancedCourse.title} — *${advancedCourse.platform}* (⭐ ${advancedCourse.rating}) |\n`;
    if (advancedProject) response += `| **💡 Project** | ${advancedProject.title} — ${advancedProject.duration} |\n`;
    response += `\n`;

    // Phase 4
    response += `### Phase 4: Job Ready (Month 7+)\n\n`;
    response += `| Area | Action |\n|------|--------|\n`;
    response += `| **📄 Resume** | Polish portfolio & tailor resume |\n`;
    response += `| **🎤 Interview** | Practice interview questions |\n`;
    response += `| **🌐 Network** | Apply to jobs & build connections |\n\n`;

    response += `💪 *Want me to drill down into any phase? Ask for courses, projects, or skills for ${domain}!*`;
    return response;
};

const generateCareerInfoResponse = (domain) => {
    if (!domain) {
        return `I can tell you about these career paths:\n\n${DOMAINS.map((d, i) => `${i + 1}. **${d}**`).join('\n')}\n\nWhich one interests you? Or ask me to compare two careers!`;
    }

    const skills = careerSkills[domain];
    const domainProjects = careerProjects[domain];
    const domainCourses = courses[domain];

    const skillCount = skills ? Object.values(skills.technical || {}).flat().length : 0;
    const projectCount = domainProjects ? Object.values(domainProjects).flat().length : 0;
    const courseCount = domainCourses ? Object.values(domainCourses).flat().length : 0;

    const essentials = skills?.technical?.essential?.join(', ') || 'Various technical skills';

    return `## ${domain} 🎯\n\nA ${domain} is a professional who specializes in their domain, working with cutting-edge technologies and methodologies.\n\n📊 **What I have for you:**\n• ${skillCount} skills mapped across 3 levels\n• ${courseCount} curated courses (free & paid)\n• ${projectCount} project ideas\n• Interview question bank\n\n🛠️ **Core Skills:** ${essentials}\n\n🚀 **Getting Started:** Ask me for a roadmap, courses, skills breakdown, or project ideas!\n\n*Try: \"roadmap for ${domain}\" or \"beginner projects for ${domain}\"*`;
};

const generateComparisonResponse = (text) => {
    const foundDomains = [];
    for (const [alias, domain] of Object.entries(DOMAIN_ALIASES)) {
        if (text.toLowerCase().includes(alias) && !foundDomains.includes(domain)) {
            foundDomains.push(domain);
        }
    }

    if (foundDomains.length < 2) {
        return `I'd love to compare careers for you! Please mention two domains, like:\n*"Compare Data Science vs Backend Development"*\n\nAvailable: ${DOMAINS.join(', ')}`;
    }

    const [d1, d2] = foundDomains;
    const s1 = careerSkills[d1];
    const s2 = careerSkills[d2];

    const skills1 = s1?.technical?.essential?.slice(0, 4).join(', ') || 'N/A';
    const skills2 = s2?.technical?.essential?.slice(0, 4).join(', ') || 'N/A';
    const soft1 = s1?.soft?.slice(0, 3).join(', ') || 'N/A';
    const soft2 = s2?.soft?.slice(0, 3).join(', ') || 'N/A';

    return `## ${d1} vs ${d2} ⚖️\n\n| Aspect | ${d1} | ${d2} |\n|--------|-------|-------|\n| Core Skills | ${skills1} | ${skills2} |\n| Soft Skills | ${soft1} | ${soft2} |\n| Projects | ${careerProjects[d1] ? '✅ Available' : '❌'} | ${careerProjects[d2] ? '✅ Available' : '❌'} |\n| Courses | ${courses[d1] ? '✅ Available' : '❌'} | ${courses[d2] ? '✅ Available' : '❌'} |\n\n💡 *Both are excellent career choices! Would you like a deeper dive into either?*`;
};

const generateSalaryResponse = (domain) => {
    const salaryData = {
        'Data Scientist': { entry: '₹6-12 LPA', mid: '₹12-25 LPA', senior: '₹25-50+ LPA' },
        'Backend Developer': { entry: '₹5-10 LPA', mid: '₹10-20 LPA', senior: '₹20-45+ LPA' },
        'Frontend Developer': { entry: '₹4-8 LPA', mid: '₹8-18 LPA', senior: '₹18-40+ LPA' },
        'UI/UX Designer': { entry: '₹4-8 LPA', mid: '₹8-16 LPA', senior: '₹16-35+ LPA' },
        'AI/ML Engineer': { entry: '₹8-15 LPA', mid: '₹15-30 LPA', senior: '₹30-60+ LPA' },
        'Product Manager': { entry: '₹8-15 LPA', mid: '₹15-30 LPA', senior: '₹30-60+ LPA' },
        'Cybersecurity Analyst': { entry: '₹5-10 LPA', mid: '₹10-22 LPA', senior: '₹22-45+ LPA' },
        'Cloud Engineer': { entry: '₹6-12 LPA', mid: '₹12-25 LPA', senior: '₹25-50+ LPA' },
        'Business Analyst': { entry: '₹4-8 LPA', mid: '₹8-18 LPA', senior: '₹18-35+ LPA' },
        'Data Analyst': { entry: '₹4-8 LPA', mid: '₹8-16 LPA', senior: '₹16-30+ LPA' },
    };

    if (domain && salaryData[domain]) {
        const s = salaryData[domain];
        return `## 💰 ${domain} — Salary Guide (India)\n\n| Level | Salary Range |\n|-------|-------------|\n| 🟢 Entry Level (0-2 yrs) | ${s.entry} |\n| 🔵 Mid Level (3-5 yrs) | ${s.mid} |\n| 🟣 Senior Level (6+ yrs) | ${s.senior} |\n\n*Salaries vary by company, city, and skills. Top-tier companies may offer significantly more.*\n\n💡 *Want to know what skills can boost your salary? Ask about skills for ${domain}!*`;
    }

    const table = Object.entries(salaryData)
        .map(([name, s]) => `| ${name} | ${s.entry} | ${s.mid} | ${s.senior} |`)
        .join('\n');

    return `## 💰 Salary Comparison — Tech Careers in India\n\n| Career | Entry | Mid | Senior |\n|--------|-------|-----|--------|\n${table}\n\n*Ask about a specific career for a detailed breakdown!*`;
};

const generateToolResponse = (domain) => {
    const skills = careerSkills[domain];
    if (!skills?.tools) {
        return `I can tell you about tools for: ${DOMAINS.join(', ')}. Which career are you interested in?`;
    }

    const essential = skills.tools.essential?.join(', ') || 'N/A';
    const recommended = skills.tools.recommended?.join(', ') || 'N/A';
    const advanced = skills.tools.advanced?.join(', ') || 'N/A';

    return `## 🔧 Tools for ${domain}\n\n**Must-Have:**\n${essential}\n\n**Recommended:**\n${recommended}\n\n**Advanced:**\n${advanced}\n\n💡 *Start with the must-have tools. As you grow, gradually adopt the recommended and advanced ones.*`;
};

// ─── Job Search Response ─────────────────────────────────────────────
const JOB_SEARCH_URLS = {
    'Data Scientist': { keyword: 'data+scientist', naukri: 'data-scientist' },
    'Backend Developer': { keyword: 'backend+developer', naukri: 'backend-developer' },
    'Frontend Developer': { keyword: 'frontend+developer', naukri: 'frontend-developer' },
    'UI/UX Designer': { keyword: 'ui+ux+designer', naukri: 'ui-ux-designer' },
    'AI/ML Engineer': { keyword: 'machine+learning+engineer', naukri: 'machine-learning-engineer' },
    'Product Manager': { keyword: 'product+manager', naukri: 'product-manager' },
    'Cybersecurity Analyst': { keyword: 'cybersecurity+analyst', naukri: 'cyber-security' },
    'Cloud Engineer': { keyword: 'cloud+engineer', naukri: 'cloud-engineer' },
    'Business Analyst': { keyword: 'business+analyst', naukri: 'business-analyst' },
    'Data Analyst': { keyword: 'data+analyst', naukri: 'data-analyst' },
};

const generateJobSearchResponse = (domain) => {
    if (!domain) {
        let response = `## 💼 Job Search — All Careers\n\nPick a career to see live job listings:\n\n`;
        response += `| Career | LinkedIn | Indeed | Naukri |\n|--------|----------|--------|--------|\n`;
        Object.entries(JOB_SEARCH_URLS).forEach(([name, urls]) => {
            response += `| **${name}** | [Search](https://www.linkedin.com/jobs/search/?keywords=${urls.keyword}) | [Search](https://www.indeed.com/jobs?q=${urls.keyword}) | [Search](https://www.naukri.com/${urls.naukri}-jobs) |\n`;
        });
        response += `\n💡 *Links open in your browser. Say a specific career like "jobs for data science" for a detailed view!*`;
        return response;
    }

    const urls = JOB_SEARCH_URLS[domain];
    if (!urls) {
        return `I don't have job search links for that domain. Try one of: ${DOMAINS.join(', ')}`;
    }

    const skills = careerSkills[domain];
    const essentials = skills?.technical?.essential?.slice(0, 5).join(', ') || 'Relevant skills';

    let response = `## 💼 ${domain} — Job Listings\n\n`;
    response += `### 🔍 Search on Top Platforms\n\n`;
    response += `| Platform | Link | Focus |\n|----------|------|-------|\n`;
    response += `| **LinkedIn** | [View Jobs](https://www.linkedin.com/jobs/search/?keywords=${urls.keyword}) | Global opportunities |\n`;
    response += `| **Indeed** | [View Jobs](https://www.indeed.com/jobs?q=${urls.keyword}) | International listings |\n`;
    response += `| **Glassdoor** | [View Jobs](https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${urls.keyword}) | Reviews + salaries |\n`;
    response += `| **Naukri** | [View Jobs](https://www.naukri.com/${urls.naukri}-jobs) | India-focused |\n`;
    response += `| **Internshala** | [View Jobs](https://internshala.com/internships/${urls.naukri}-internship) | Internships |\n\n`;
    response += `### 📋 Key Skills Employers Look For\n${essentials}\n\n`;
    response += `💡 *Tip: Tailor your resume with these skills. Want me to analyze your resume or suggest projects to strengthen your profile?*`;
    return response;
};

// ─── Calendar / Study Schedule Response ──────────────────────────────
const generateCalendarResponse = (domain) => {
    if (!domain) {
        return `I can create a study schedule for any career! Which domain?\n\n${DOMAINS.map(d => `• ${d}`).join('\n')}\n\n💡 *Just say "schedule for data science" or "study plan for backend"!*`;
    }

    const skills = careerSkills[domain];
    const domainCourses = courses[domain];
    if (!skills) {
        return `I don't have enough data to create a schedule for that domain yet.`;
    }

    const essentials = skills.technical?.essential?.slice(0, 4) || ['Fundamentals'];
    const recommended = skills.technical?.recommended?.slice(0, 3) || ['Frameworks'];
    const advanced = skills.technical?.advanced?.slice(0, 2) || ['Specialization'];
    const firstCourse = domainCourses?.beginner?.[0];

    let response = `## 📅 Study Schedule — ${domain}\n\n`;
    response += `### 📆 8-Week Intensive Plan\n\n`;
    response += `| Week | Focus | Topics | Hours/Day |\n|------|-------|--------|-----------|\n`;
    response += `| 1-2 | 🟢 Foundations | ${essentials.slice(0, 2).join(', ')} | 2-3 hrs |\n`;
    response += `| 3-4 | 🟢 Core Skills | ${essentials.slice(2).join(', ') || 'Practice problems'} | 2-3 hrs |\n`;
    response += `| 5-6 | 🔵 Intermediate | ${recommended.join(', ')} | 3-4 hrs |\n`;
    response += `| 7-8 | 🟣 Projects | Build portfolio project | 3-4 hrs |\n\n`;

    // Generate ICS content for the study plan
    const icsEvents = [
        { summary: `${domain}: Learn ${essentials[0]}`, weekOffset: 0 },
        { summary: `${domain}: Learn ${essentials[1] || essentials[0]}`, weekOffset: 1 },
        { summary: `${domain}: Practice ${essentials.slice(2).join(' & ') || 'Core Concepts'}`, weekOffset: 2 },
        { summary: `${domain}: ${firstCourse ? firstCourse.title : 'Online Course'}`, weekOffset: 3 },
        { summary: `${domain}: Learn ${recommended[0] || 'Frameworks'}`, weekOffset: 4 },
        { summary: `${domain}: Learn ${recommended[1] || 'Tools'}`, weekOffset: 5 },
        { summary: `${domain}: Build Portfolio Project`, weekOffset: 6 },
        { summary: `${domain}: Polish & Review`, weekOffset: 7 },
    ];

    response += `### 📥 Add to Your Calendar\n\n`;
    response += `Type **"download calendar ${domain.toLowerCase()}"** to get an **.ics file** you can import into Google Calendar, Apple Calendar, or Outlook!\n\n`;

    // Google Calendar quick-add link for the first session
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + ((1 + 7 - startDate.getDay()) % 7 || 7)); // next Monday
    const startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`SkillGPS: Start ${domain} Journey`)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(`Week 1: Learn ${essentials[0]}. Start your ${domain} journey with SkillGPS!`)}`;

    response += `Or **[Add First Session to Google Calendar](${gcalUrl})**\n\n`;
    response += `💡 *Consistency beats intensity! Even 1 hour/day compounds into massive growth.*`;
    return response;
};

// ─── ICS File Generator (exported for Chatbot.jsx to use) ────────────
export const generateICSFile = (domain) => {
    const skills = careerSkills[domain];
    if (!skills) return null;

    const essentials = skills.technical?.essential || ['Fundamentals'];
    const recommended = skills.technical?.recommended || ['Frameworks'];

    const now = new Date();
    const startMonday = new Date(now);
    startMonday.setDate(startMonday.getDate() + ((1 + 7 - startMonday.getDay()) % 7 || 7));
    startMonday.setHours(9, 0, 0, 0);

    const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const events = [
        { title: `Learn ${essentials[0]}`, week: 0 },
        { title: `Learn ${essentials[1] || 'Core Concepts'}`, week: 1 },
        { title: `Practice ${essentials.slice(2, 4).join(' & ') || 'Problems'}`, week: 2 },
        { title: `Online Course Deep-Dive`, week: 3 },
        { title: `Learn ${recommended[0] || 'Frameworks'}`, week: 4 },
        { title: `Learn ${recommended[1] || 'Advanced Tools'}`, week: 5 },
        { title: `Build Portfolio Project`, week: 6 },
        { title: `Polish & Review`, week: 7 },
    ];

    let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SkillGPS//Study Plan//EN\nCALSCALE:GREGORIAN\n`;

    events.forEach(evt => {
        const start = new Date(startMonday);
        start.setDate(start.getDate() + evt.week * 7);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

        // Add 5 sessions per week (Mon-Fri)
        for (let day = 0; day < 5; day++) {
            const sessionStart = new Date(start);
            sessionStart.setDate(sessionStart.getDate() + day);
            const sessionEnd = new Date(sessionStart.getTime() + 2 * 60 * 60 * 1000);

            ics += `BEGIN:VEVENT\n`;
            ics += `DTSTART:${formatDate(sessionStart)}\n`;
            ics += `DTEND:${formatDate(sessionEnd)}\n`;
            ics += `SUMMARY:SkillGPS: ${domain} — ${evt.title}\n`;
            ics += `DESCRIPTION:Week ${evt.week + 1} of your ${domain} study plan. Powered by SkillGPS.\n`;
            ics += `END:VEVENT\n`;
        }
    });

    ics += `END:VCALENDAR`;
    return ics;
};

// ─── GitHub Analysis (exported for Chatbot.jsx to use) ───────────────
const LANGUAGE_TO_DOMAIN = {
    'Python': ['Data Scientist', 'AI/ML Engineer', 'Backend Developer', 'Data Analyst'],
    'JavaScript': ['Frontend Developer', 'Backend Developer'],
    'TypeScript': ['Frontend Developer', 'Backend Developer'],
    'Java': ['Backend Developer', 'Android Developer'],
    'Kotlin': ['Android Developer'],
    'Swift': ['iOS Developer'],
    'HTML': ['Frontend Developer', 'UI/UX Designer'],
    'CSS': ['Frontend Developer', 'UI/UX Designer'],
    'R': ['Data Scientist', 'Data Analyst'],
    'SQL': ['Data Analyst', 'Data Scientist', 'Backend Developer'],
    'Shell': ['Cloud Engineer', 'Backend Developer'],
    'Go': ['Backend Developer', 'Cloud Engineer'],
    'Rust': ['Backend Developer'],
    'C++': ['Backend Developer'],
    'C#': ['Backend Developer'],
    'Ruby': ['Backend Developer'],
    'PHP': ['Backend Developer'],
    'Jupyter Notebook': ['Data Scientist', 'AI/ML Engineer', 'Data Analyst'],
    'Dockerfile': ['Cloud Engineer'],
    'HCL': ['Cloud Engineer'],
    'SCSS': ['Frontend Developer'],
    'Vue': ['Frontend Developer'],
    'Dart': ['Frontend Developer'],
};

export const analyzeGitHubRepos = (repos) => {
    const languages = {};
    const topics = new Set();
    let totalStars = 0;
    let totalForks = 0;

    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
        (repo.topics || []).forEach(t => topics.add(t));
    });

    // Map languages to career domains
    const domainScores = {};
    Object.entries(languages).forEach(([lang, count]) => {
        const domains = LANGUAGE_TO_DOMAIN[lang] || [];
        domains.forEach(d => {
            domainScores[d] = (domainScores[d] || 0) + count;
        });
    });

    const sortedDomains = Object.entries(domainScores)
        .sort((a, b) => b[1] - a[1]);

    const primaryDomain = sortedDomains[0]?.[0] || null;
    const sortedLangs = Object.entries(languages)
        .sort((a, b) => b[1] - a[1]);

    // Find skill gaps
    let skillGaps = [];
    if (primaryDomain && careerSkills[primaryDomain]) {
        const essentialSkills = careerSkills[primaryDomain].technical?.essential || [];
        const userLangs = new Set(Object.keys(languages).map(l => l.toLowerCase()));
        const userTopics = new Set([...topics].map(t => t.toLowerCase()));
        skillGaps = essentialSkills.filter(skill => {
            const lower = skill.toLowerCase();
            return !userLangs.has(lower) && !userTopics.has(lower);
        });
    }

    return {
        repoCount: repos.length,
        languages: sortedLangs,
        totalStars,
        totalForks,
        topics: [...topics],
        domainScores: sortedDomains,
        primaryDomain,
        skillGaps: skillGaps.slice(0, 8),
    };
};

export const formatGitHubAnalysis = (analysis, username) => {
    let response = `## 🐙 GitHub Analysis — @${username}\n\n`;

    // Stats overview
    response += `### 📊 Portfolio Stats\n\n`;
    response += `| Metric | Value |\n|--------|-------|\n`;
    response += `| **Repositories** | ${analysis.repoCount} |\n`;
    response += `| **Total Stars** | ⭐ ${analysis.totalStars} |\n`;
    response += `| **Total Forks** | 🔱 ${analysis.totalForks} |\n\n`;

    // Languages
    response += `### 💻 Languages Used\n\n`;
    response += `| Language | Repos | Strength |\n|----------|-------|----------|\n`;
    const maxCount = analysis.languages[0]?.[1] || 1;
    analysis.languages.slice(0, 8).forEach(([lang, count]) => {
        const bar = '█'.repeat(Math.ceil((count / maxCount) * 5));
        response += `| **${lang}** | ${count} | ${bar} |\n`;
    });
    response += `\n`;

    // Career match
    if (analysis.domainScores.length > 0) {
        response += `### 🎯 Career Match\n\n`;
        response += `| Career | Match Score |\n|--------|-------------|\n`;
        analysis.domainScores.slice(0, 4).forEach(([domain, score]) => {
            const pct = Math.min(100, Math.round((score / (analysis.repoCount || 1)) * 100));
            response += `| **${domain}** | ${'🟩'.repeat(Math.ceil(pct / 20))} ${pct}% |\n`;
        });
        response += `\n`;
    }

    // Skill gaps
    if (analysis.skillGaps.length > 0 && analysis.primaryDomain) {
        response += `### ⚠️ Skill Gaps for ${analysis.primaryDomain}\n\n`;
        response += `You should learn: **${analysis.skillGaps.join(', ')}**\n\n`;
        response += `💡 *Ask me for "courses for ${analysis.primaryDomain}" or "projects for ${analysis.primaryDomain}" to fill these gaps!*\n\n`;
    }

    // Topics
    if (analysis.topics.length > 0) {
        response += `### 🏷️ Topics\n${analysis.topics.slice(0, 12).join(', ')}\n\n`;
    }

    response += `🚀 *Great portfolio! Want a roadmap or course recommendations based on your profile?*`;
    return response;
};

// ─── General / Fallback Responses ────────────────────────────────────
const generalResponses = [
    "I'm not quite sure what you're asking, but I'm great at career guidance! 🎯\n\nTry asking me:\n• *\"What skills do I need for Data Science?\"*\n• *\"Recommend courses for Backend Development\"*\n• *\"Analyze my GitHub profile\"*\n• *\"Find jobs for AI/ML\"*\n• *\"Schedule a study plan\"*",
    "Hmm, I didn't catch that. I'm designed to help with **career navigation**! 🧭\n\nHere's what I can do:\n• 📚 Course recommendations\n• 🛠️ Skill breakdowns\n• 💡 Project ideas\n• 🗺️ Career roadmaps\n• 💼 Job listings\n• 🐙 GitHub analysis\n• 📅 Study scheduling\n\nWhich topic interests you?",
    "I'm specialized in career guidance and may not have the answer to that specific question. 🤔\n\nBut I'm an expert in these areas:\n${DOMAINS.map(d => `• ${d}`).join('\\n')}\n\nPick any career and I'll help you plan your learning journey!",
];

// ─── Main Brain Function ─────────────────────────────────────────────
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Process a user message and return a bot response.
 * @param {string} userMessage - The user's input text
 * @param {Object} context - Optional context (resumeData, conversationHistory, etc.)
 * @returns {string} The bot's response in markdown format
 */
export const processMessage = (userMessage, context = {}) => {
    const text = userMessage.trim();
    if (!text) return "I didn't get that. Could you say something? 😊";

    const intent = classifyIntent(text);
    const domain = extractDomain(text);
    const level = extractLevel(text);

    // Use stored domain from context if not found in message
    const effectiveDomain = domain || context.lastDomain || null;

    switch (intent) {
        case 'greeting':
            return pickRandom(greetingResponses);

        case 'farewell':
            return pickRandom(farewellResponses);

        case 'thanks':
            return pickRandom(thanksResponses);

        case 'about_bot':
            return pickRandom(aboutBotResponses);

        case 'motivation':
            return pickRandom(motivationResponses);

        case 'course_recommendation':
            if (effectiveDomain) {
                return generateCourseResponse(effectiveDomain, level);
            }
            return `I'd love to recommend courses! Which career field are you interested in?\n\nAvailable domains:\n${DOMAINS.map(d => `• ${d}`).join('\n')}`;

        case 'skill_inquiry':
            if (effectiveDomain) {
                return generateSkillResponse(effectiveDomain);
            }
            return `Which career's skills do you want to know about?\n\n${DOMAINS.map(d => `• ${d}`).join('\n')}`;

        case 'project_suggestion':
            if (effectiveDomain) {
                return generateProjectResponse(effectiveDomain, level);
            }
            return `I have project ideas for many careers! Which domain?\n\n${Object.keys(careerProjects).map(d => `• ${d}`).join('\n')}`;

        case 'career_info':
            return generateCareerInfoResponse(effectiveDomain);

        case 'interview_prep':
            // Return a message that triggers the interview mode in Chatbot.jsx
            return '__TRIGGER_INTERVIEW_MODE__';

        case 'comparison':
            return generateComparisonResponse(text);

        case 'roadmap':
            if (effectiveDomain) {
                return generateRoadmapResponse(effectiveDomain);
            }
            return `I can create a roadmap for any of these careers:\n\n${DOMAINS.map(d => `• ${d}`).join('\n')}\n\nWhich one interests you?`;

        case 'salary_info':
            return generateSalaryResponse(effectiveDomain);

        case 'tool_inquiry':
            if (effectiveDomain) {
                return generateToolResponse(effectiveDomain);
            }
            return `Which career's tools do you want to learn about?\n\n${DOMAINS.map(d => `• ${d}`).join('\n')}`;

        case 'github_analysis':
            return '__TRIGGER_GITHUB_ANALYSIS__';

        case 'linkedin_import':
            return '__TRIGGER_LINKEDIN_IMPORT__';

        case 'calendar_schedule': {
            // Check for "download calendar" command
            const lowerText = text.toLowerCase();
            if (lowerText.includes('download calendar') || lowerText.includes('download ics')) {
                return `__TRIGGER_CALENDAR_DOWNLOAD__${effectiveDomain || ''}`;
            }
            return generateCalendarResponse(effectiveDomain);
        }

        case 'job_search':
            return generateJobSearchResponse(effectiveDomain);

        default:
            // Check for calendar download command in non-calendar intents too
            if (text.toLowerCase().includes('download calendar')) {
                return `__TRIGGER_CALENDAR_DOWNLOAD__${effectiveDomain || ''}`;
            }
            // Try to give a domain-specific general response if domain is detected
            if (effectiveDomain) {
                return generateCareerInfoResponse(effectiveDomain);
            }
            return pickRandom(generalResponses);
    }
};

/**
 * Get the extracted domain from a message (used by Chatbot for context tracking)
 */
export const getDomainFromMessage = (text) => extractDomain(text);
export { extractDomain };
