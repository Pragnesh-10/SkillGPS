// Vector Space Model (VSM) for Career Recommendations
// Uses Cosine Similarity to find the nearest career centroid to the user's profile vector.

// 1. Define Attributes (Dimensions of our vector space)
const ALL_ATTRIBUTES = [
    // Work Style
    'env_solo', 'env_team', 'struct_structured', 'struct_flexible', 'role_dynamic', 'role_desk',
    // Interests
    'int_numbers', 'int_building', 'int_design', 'int_explaining', 'int_logic',
    // Confidence (Normalized to 0-1)
    'conf_math', 'conf_coding', 'conf_communication'
];

// 2. Define Career Centroids (Ideal vectors for each career)
// Values are between 0 and 1 representing importance/alignment
const CAREER_VECTORS = {
    'Data Scientist': {
        env_solo: 0.6, env_team: 0.4, struct_structured: 0.7, struct_flexible: 0.3, role_desk: 0.9,
        int_numbers: 1.0, int_logic: 0.9, int_explaining: 0.6,
        conf_math: 0.9, conf_coding: 0.8, conf_communication: 0.6
    },
    'Backend Developer': {
        env_solo: 0.8, env_team: 0.2, struct_structured: 0.8, struct_flexible: 0.2, role_desk: 1.0,
        int_building: 1.0, int_logic: 0.9, int_numbers: 0.4,
        conf_coding: 1.0, conf_math: 0.5, conf_communication: 0.3
    },
    'UI/UX Designer': {
        env_solo: 0.4, env_team: 0.6, struct_flexible: 0.9, struct_structured: 0.1, role_desk: 0.9,
        int_design: 1.0, int_building: 0.5, int_explaining: 0.4,
        conf_communication: 0.7, conf_coding: 0.3, conf_math: 0.2
    },
    'Product Manager': {
        env_team: 1.0, env_solo: 0.0, struct_flexible: 0.8, struct_structured: 0.2, role_dynamic: 0.7,
        int_explaining: 1.0, int_design: 0.4, int_logic: 0.6,
        conf_communication: 1.0, conf_math: 0.5, conf_coding: 0.3
    },
    'Cybersecurity Analyst': {
        env_solo: 0.7, env_team: 0.3, struct_structured: 1.0, struct_flexible: 0.0, role_desk: 0.9,
        int_logic: 1.0, int_numbers: 0.6, int_building: 0.3,
        conf_coding: 0.7, conf_math: 0.6, conf_communication: 0.4
    },
    'Cloud Engineer': {
        env_solo: 0.6, env_team: 0.4, struct_structured: 0.7, struct_flexible: 0.3, role_desk: 0.8,
        int_building: 0.9, int_logic: 0.8, int_numbers: 0.3,
        conf_coding: 0.8, conf_math: 0.4, conf_communication: 0.5
    },
    'AI/ML Engineer': {
        env_solo: 0.5, env_team: 0.5, struct_flexible: 0.7, struct_structured: 0.3, role_desk: 0.9,
        int_numbers: 1.0, int_building: 0.8, int_logic: 1.0,
        conf_math: 1.0, conf_coding: 0.9, conf_communication: 0.5
    },
    'Business Analyst': {
        env_team: 0.8, env_solo: 0.2, struct_structured: 0.8, struct_flexible: 0.2, role_dynamic: 0.5,
        int_explaining: 0.9, int_numbers: 0.7, int_logic: 0.6,
        conf_communication: 0.9, conf_math: 0.6, conf_coding: 0.2
    }
};

// --- Math Helpers ---

const dotProduct = (vecA, vecB) => {
    let product = 0;
    for (const dim of ALL_ATTRIBUTES) {
        product += (vecA[dim] || 0) * (vecB[dim] || 0);
    }
    return product;
};

const magnitude = (vec) => {
    let sumSq = 0;
    for (const dim of ALL_ATTRIBUTES) {
        sumSq += (vec[dim] || 0) ** 2;
    }
    return Math.sqrt(sumSq);
};

const cosineSimilarity = (vecA, vecB) => {
    const dot = dotProduct(vecA, vecB);
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);
    return (magA && magB) ? dot / (magA * magB) : 0;
};

// --- Main Engine ---

const createUserVector = (data) => {
    const vec = {};
    const { interests, confidence, workStyle } = data;

    // Work Style (One-Hot-like encoding)
    if (workStyle?.environment === 'Solo') vec.env_solo = 1; else vec.env_team = 1;
    if (workStyle?.structure === 'Structured') vec.struct_structured = 1; else vec.struct_flexible = 1;
    if (workStyle?.roleType === 'Dynamic') vec.role_dynamic = 1; else vec.role_desk = 1;

    // Interests (Boolean to 1.0)
    if (interests?.numbers) vec.int_numbers = 1;
    if (interests?.building) vec.int_building = 1;
    if (interests?.design) vec.int_design = 1;
    if (interests?.explaining) vec.int_explaining = 1;
    if (interests?.logic) vec.int_logic = 1;

    // Confidence (Scale 1-10 to 0.0-1.0)
    if (confidence) {
        vec.conf_math = (confidence.math || 1) / 10;
        vec.conf_coding = (confidence.coding || 1) / 10;
        vec.conf_communication = (confidence.communication || 1) / 10;
    }

    return vec;
};

export const getRecommendations = (data) => {
    const userVector = createUserVector(data);

    // Calculate similarity with every career
    const results = Object.entries(CAREER_VECTORS).map(([career, careerVector]) => {
        const similarity = cosineSimilarity(userVector, careerVector);
        return {
            career,
            score: similarity
        };
    });

    // Sort by descending score
    results.sort((a, b) => b.score - a.score);

    // Return top 3 format
    return results.slice(0, 3).map(r => ({
        career: r.career,
        prob: parseFloat(r.score.toFixed(2)) // Keep precision for UI
    }));
};

