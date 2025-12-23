export const getRecommendations = (data) => {
    // Initialize scores
    const scores = {
        'Data Scientist': 0,
        'Backend Developer': 0,
        'UI/UX Designer': 0,
        'Cybersecurity Analyst': 0,
        'Product Manager': 0,
        'Cloud Engineer': 0,
        'AI/ML Engineer': 0,
        'Business Analyst': 0
    };

    const { interests, confidence, workStyle, intent } = data;

    // --- 1. Work Style Analysis (Counselor Personality Fit) ---
    const ws = workStyle || {};

    // Environment: Solo vs Team
    if (ws.environment === 'Solo') {
        scores['Backend Developer'] += 3;
        scores['Cybersecurity Analyst'] += 4; // High focus, often independent
        scores['Cloud Engineer'] += 3;
        scores['Data Scientist'] += 2;
    } else if (ws.environment === 'Team') {
        scores['Product Manager'] += 5; // Heavy collaboration
        scores['Business Analyst'] += 4;
        scores['UI/UX Designer'] += 3; // Closely works with product/devs
    }

    // Structure: Structured vs Flexible
    if (ws.structure === 'Structured') {
        scores['Cybersecurity Analyst'] += 3; // Protocols/Compliance
        scores['Backend Developer'] += 2; // Defined specs usually
        scores['Business Analyst'] += 3;
    } else if (ws.structure === 'Flexible') {
        scores['UI/UX Designer'] += 3; // Creative iteration
        scores['Product Manager'] += 3; // Handling ambiguity
        scores['AI/ML Engineer'] += 2; // Experimentation nature
    }

    // Role Type: Desk vs Dynamic
    if (ws.roleType === 'Dynamic') {
        scores['Product Manager'] += 4;
        scores['Business Analyst'] += 2;
    } else {
        scores['Backend Developer'] += 2;
        scores['Cloud Engineer'] += 2;
    }


    // --- 2. Interest Signals (Core Passion) ---
    const ints = interests || {};

    if (ints.numbers) {
        scores['Data Scientist'] += 5; // Direct match
        scores['AI/ML Engineer'] += 4;
        scores['Business Analyst'] += 3;
        scores['Cybersecurity Analyst'] += 2; // Cryptography/Sequences
    }

    if (ints.building) {
        scores['Backend Developer'] += 5;
        scores['Cloud Engineer'] += 4;
        scores['AI/ML Engineer'] += 3; // Building models
        scores['UI/UX Designer'] += 1; // Prototyping
    }

    if (ints.design) {
        scores['UI/UX Designer'] += 8; // Primary signal
        scores['Product Manager'] += 3; // UX awareness
    }

    if (ints.explaining) {
        scores['Product Manager'] += 5;
        scores['Business Analyst'] += 5;
        scores['Data Scientist'] += 2; // Storytelling with data
    }

    if (ints.logic) {
        scores['Backend Developer'] += 3;
        scores['Data Scientist'] += 2;
        scores['Cybersecurity Analyst'] += 3;
    }


    // --- 3. Career Intent (Goals) ---
    const usrIntent = intent || {};

    if (usrIntent.nature === 'research') {
        scores['AI/ML Engineer'] += 5;
        scores['Data Scientist'] += 4;
    } else if (usrIntent.nature === 'applied') {
        scores['Backend Developer'] += 3;
        scores['Product Manager'] += 3;
        scores['Cloud Engineer'] += 3;
        scores['UI/UX Designer'] += 2;
    }

    if (usrIntent.workplace === 'corporate') {
        scores['Business Analyst'] += 2;
        scores['Cybersecurity Analyst'] += 3; // Big corps hire security teams
    } else if (usrIntent.workplace === 'startup') {
        scores['Product Manager'] += 2;
        scores['Backend Developer'] += 2; // Builders needed
    }


    // --- 4. Confidence & Skills (Capability) ---
    const conf = confidence || {};

    // Math Confidence
    if (conf.math >= 8) {
        scores['Data Scientist'] += 4;
        scores['AI/ML Engineer'] += 4;
    } else if (conf.math <= 4) {
        scores['Data Scientist'] -= 5; // Hard to do DS without math
        scores['AI/ML Engineer'] -= 3;
    }

    // Coding Confidence
    if (conf.coding >= 8) {
        scores['Backend Developer'] += 4;
        scores['Cloud Engineer'] += 4;
        scores['AI/ML Engineer'] += 3;
    } else if (conf.coding <= 3) {
        scores['Backend Developer'] -= 5;
        // Boost low-code/no-code friendly roles slightly relative to dev
        scores['Product Manager'] += 2;
        scores['Business Analyst'] += 2;
        scores['UI/UX Designer'] += 1;
    }

    // Communication Confidence
    if (conf.communication >= 8) {
        scores['Product Manager'] += 5;
        scores['Business Analyst'] += 4;
        scores['UI/UX Designer'] += 2; // presenting designs
    } else if (conf.communication <= 4) {
        scores['Product Manager'] -= 5; // Crucial for PM
        scores['Backend Developer'] += 1; // Slight bias towards solo work?
    }


    // --- 5. Tech Skills (Bonus if checked) ---



    // Normalize and Sort
    // Add some randomness to break ties for consistent inputs? 
    // No, deterministic is better for testing.

    return Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([domain]) => domain);
};
