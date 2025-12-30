// Resume Parser - Extracts skills and information from resume text

// Common skill keywords to look for
const SKILL_PATTERNS = {
    programming: [
        'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
        'go', 'rust', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'shell', 'bash'
    ],
    frameworks: [
        'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'spring boot',
        'laravel', '.net', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
        'next.js', 'nest.js', 'fastapi', 'rails'
    ],
    databases: [
        'mysql', 'postgresql', 'mongodb', 'redis', 'cassandra', 'oracle', 'sql server', 'sqlite',
        'dynamodb', 'elasticsearch', 'bigquery', 'snowflake'
    ],
    cloud: [
        'aws', 'azure', 'gcp', 'google cloud', 'cloud computing', 'serverless', 'lambda', 'ec2',
        's3', 'cloudformation', 'terraform', 'kubernetes', 'docker', 'container'
    ],
    tools: [
        'git', 'github', 'gitlab', 'jenkins', 'ci/cd', 'jira', 'confluence', 'docker', 'kubernetes',
        'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'vs code', 'jupyter',
        'postman', 'tableau', 'power bi', 'excel', 'slack', 'trello'
    ],
    methods: [
        'agile', 'scrum', 'kanban', 'devops', 'tdd', 'bdd', 'microservices', 'rest api', 'graphql',
        'machine learning', 'deep learning', 'nlp', 'computer vision', 'data analysis', 'statistics',
        'ux research', 'user testing', 'wireframing', 'prototyping', 'a/b testing'
    ],
    design: [
        'ui design', 'ux design', 'user experience', 'user interface', 'responsive design',
        'design systems', 'accessibility', 'wireframing', 'prototyping', 'figma', 'sketch',
        'adobe xd', 'invision', 'material design', 'css', 'html5'
    ],
    soft: [
        'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
        'time management', 'collaboration', 'adaptability', 'creativity', 'analytical',
        'attention to detail', 'project management', 'stakeholder management'
    ]
};

// Flatten all skills into a single searchable list
const ALL_SKILLS = [
    ...SKILL_PATTERNS.programming,
    ...SKILL_PATTERNS.frameworks,
    ...SKILL_PATTERNS.databases,
    ...SKILL_PATTERNS.cloud,
    ...SKILL_PATTERNS.tools,
    ...SKILL_PATTERNS.methods,
    ...SKILL_PATTERNS.design,
    ...SKILL_PATTERNS.soft
];

/**
 * Parse resume text and extract skills
 * @param {string} resumeText - The full text of the resume
 * @returns {Object} - Parsed information including skills
 */
export const parseResume = (resumeText) => {
    if (!resumeText || typeof resumeText !== 'string') {
        return {
            skills: [],
            categorizedSkills: {},
            rawText: '',
            sections: {}
        };
    }

    const lowerText = resumeText.toLowerCase();
    const extractedSkills = new Set();
    const categorizedSkills = {
        programming: [],
        frameworks: [],
        databases: [],
        cloud: [],
        tools: [],
        methods: [],
        design: [],
        soft: []
    };

    // Extract skills by checking if they exist in the resume
    ALL_SKILLS.forEach(skill => {
        const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (skillPattern.test(resumeText)) {
            extractedSkills.add(skill);

            // Categorize the skill
            for (const [category, skills] of Object.entries(SKILL_PATTERNS)) {
                if (skills.includes(skill.toLowerCase())) {
                    categorizedSkills[category].push(skill);
                    break;
                }
            }
        }
    });

    // Extract sections (Skills, Experience, Education, etc.)
    const sections = extractSections(resumeText);

    return {
        skills: Array.from(extractedSkills),
        categorizedSkills,
        rawText: resumeText,
        sections,
        skillCount: extractedSkills.size
    };
};

/**
 * Extract common resume sections
 */
const extractSections = (text) => {
    const sections = {};
    const lines = text.split('\n');

    let currentSection = null;
    let sectionContent = [];

    const sectionHeaders = [
        'skills', 'experience', 'education', 'projects', 'certifications',
        'contact', 'summary', 'objective', 'awards'
    ];

    lines.forEach(line => {
        const trimmedLine = line.trim().toLowerCase();

        // Check if line is a section header
        const matchedSection = sectionHeaders.find(header =>
            trimmedLine === header || trimmedLine.startsWith(header + ':')
        );

        if (matchedSection) {
            // Save previous section
            if (currentSection) {
                sections[currentSection] = sectionContent.join('\n');
            }
            // Start new section
            currentSection = matchedSection;
            sectionContent = [];
        } else if (currentSection) {
            sectionContent.push(line);
        }
    });

    // Save last section
    if (currentSection) {
        sections[currentSection] = sectionContent.join('\n');
    }

    return sections;
};

/**
 * Extract contact information from resume
 */
export const extractContactInfo = (resumeText) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const linkedInRegex = /linkedin\.com\/in\/[\w-]+/gi;

    return {
        emails: resumeText.match(emailRegex) || [],
        phones: resumeText.match(phoneRegex) || [],
        linkedIn: resumeText.match(linkedInRegex) || []
    };
};

/**
 * Get skill suggestions based on partial resume analysis
 */
export const getSuggestedSkills = (resumeSkills, targetCareer) => {
    // This would integrate with careerSkills to provide suggestions
    return {
        missing: [],
        recommended: []
    };
};
