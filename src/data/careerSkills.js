// Database of skills required for each career path
export const careerSkills = {
    'Data Scientist': {
        technical: {
            essential: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Analysis', 'Pandas', 'NumPy'],
            recommended: ['R', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'Jupyter', 'BigQuery'],
            advanced: ['Deep Learning', 'NLP', 'Computer Vision', 'Spark', 'Hadoop', 'MLOps', 'Model Deployment']
        },
        tools: {
            essential: ['Excel', 'Git', 'Jupyter Notebook'],
            recommended: ['Docker', 'AWS', 'GCP', 'Azure', 'Tableau', 'Power BI'],
            advanced: ['Kubernetes', 'Airflow', 'MLflow', 'Databricks']
        },
        soft: ['Problem Solving', 'Communication', 'Critical Thinking', 'Data Storytelling', 'Business Acumen']
    },
    'Backend Developer': {
        technical: {
            essential: ['JavaScript', 'Node.js', 'Python', 'Java', 'SQL', 'REST API', 'Git', 'Database Design'],
            recommended: ['Express', 'Django', 'Flask', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL'],
            advanced: ['Microservices', 'System Design', 'Load Balancing', 'Message Queues', 'gRPC', 'WebSockets']
        },
        tools: {
            essential: ['Git', 'npm', 'Postman'],
            recommended: ['Docker', 'AWS', 'CI/CD', 'Jenkins', 'Nginx'],
            advanced: ['Kubernetes', 'Terraform', 'ELK Stack', 'Prometheus', 'Grafana']
        },
        soft: ['Problem Solving', 'Collaboration', 'Code Review', 'Documentation', 'System Thinking']
    },
    'UI/UX Designer': {
        technical: {
            essential: ['Figma', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing'],
            recommended: ['Adobe XD', 'Sketch', 'InVision', 'HTML', 'CSS', 'Responsive Design'],
            advanced: ['Animation', 'Design Systems', 'Interaction Design', 'Accessibility', 'Usability Testing']
        },
        tools: {
            essential: ['Figma', 'Adobe Creative Suite'],
            recommended: ['Miro', 'Whimsical', 'Zeplin', 'Abstract'],
            advanced: ['Principle', 'Framer', 'After Effects']
        },
        soft: ['Empathy', 'Communication', 'Creativity', 'Attention to Detail', 'User-Centric Thinking', 'Collaboration']
    },
    'AI/ML Engineer': {
        technical: {
            essential: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Neural Networks', 'Statistics'],
            recommended: ['Computer Vision', 'NLP', 'Reinforcement Learning', 'Scikit-learn', 'Keras', 'CUDA', 'Model Optimization'],
            advanced: ['Transformers', 'GANs', 'MLOps', 'Model Serving', 'Distributed Training', 'Edge AI']
        },
        tools: {
            essential: ['Jupyter', 'Git', 'Python IDE'],
            recommended: ['Docker', 'AWS SageMaker', 'GCP AI Platform', 'MLflow', 'Weights & Biases'],
            advanced: ['Kubernetes', 'Kubeflow', 'TensorRT', 'ONNX', 'Ray']
        },
        soft: ['Research Skills', 'Problem Solving', 'Mathematical Thinking', 'Communication', 'Experimentation']
    },
    'Product Manager': {
        technical: {
            essential: ['Product Lifecycle', 'User Stories', 'Agile', 'Scrum', 'Roadmapping', 'Analytics'],
            recommended: ['SQL', 'A/B Testing', 'API Basics', 'Wireframing', 'Data Analysis', 'Market Research'],
            advanced: ['Growth Strategy', 'Product-Market Fit', 'Pricing Strategy', 'Go-to-Market', 'Technical Architecture']
        },
        tools: {
            essential: ['Jira', 'Confluence', 'Google Analytics', 'Excel'],
            recommended: ['Mixpanel', 'Amplitude', 'Figma', 'Tableau', 'SQL databases'],
            advanced: ['Python', 'Looker', 'Product Analytics Platforms', 'CRM Tools']
        },
        soft: ['Leadership', 'Communication', 'Stakeholder Management', 'Decision Making', 'Strategic Thinking', 'Negotiation']
    },
    'Cybersecurity Analyst': {
        technical: {
            essential: ['Network Security', 'Security Fundamentals', 'Threat Analysis', 'Incident Response', 'Linux', 'Windows Security'],
            recommended: ['Penetration Testing', 'Vulnerability Assessment', 'SIEM', 'Firewalls', 'IDS/IPS', 'Encryption'],
            advanced: ['Malware Analysis', 'Forensics', 'Threat Hunting', 'Security Automation', 'Cloud Security']
        },
        tools: {
            essential: ['Wireshark', 'Nmap', 'Metasploit'],
            recommended: ['Burp Suite', 'Splunk', 'Kali Linux', 'Security Onion'],
            advanced: ['Zeek', 'OSSEC', 'Snort', 'ELK Stack']
        },
        soft: ['Analytical Thinking', 'Attention to Detail', 'Problem Solving', 'Communication', 'Continuous Learning']
    },
    'Cloud Engineer': {
        technical: {
            essential: ['Linux', 'Networking', 'AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Infrastructure as Code'],
            recommended: ['Docker', 'Kubernetes', 'Terraform', 'CloudFormation', 'CI/CD', 'Serverless', 'Monitoring'],
            advanced: ['Multi-Cloud', 'Cloud Security', 'Cost Optimization', 'High Availability', 'Disaster Recovery']
        },
        tools: {
            essential: ['AWS Console', 'Azure Portal', 'Git', 'CLI Tools'],
            recommended: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins'],
            advanced: ['Helm', 'ArgoCD', 'Prometheus', 'Grafana', 'Service Mesh']
        },
        soft: ['Problem Solving', 'Automation Mindset', 'Communication', 'Documentation', 'Cost Awareness']
    },
    'Business Analyst': {
        technical: {
            essential: ['Requirements Gathering', 'Process Modeling', 'Data Analysis', 'SQL', 'Excel', 'Business Intelligence'],
            recommended: ['BPMN', 'Use Cases', 'User Stories', 'Tableau', 'Power BI', 'Python', 'Statistics'],
            advanced: ['Predictive Analytics', 'Advanced Excel', 'Process Optimization', 'Change Management']
        },
        tools: {
            essential: ['Excel', 'PowerPoint', 'Visio', 'SQL'],
            recommended: ['Tableau', 'Power BI', 'JIRA', 'Confluence', 'Lucidchart'],
            advanced: ['Python', 'R', 'SAS', 'Advanced BI Tools']
        },
        soft: ['Communication', 'Critical Thinking', 'Problem Solving', 'Stakeholder Management', 'Documentation', 'Business Acumen']
    },
    'Data Analyst': {
        technical: {
            essential: ['SQL', 'Excel', 'Data Visualization', 'Statistics', 'Data Analysis', 'Pandas', 'Data Cleaning'],
            recommended: ['Python', 'R', 'Tableau', 'Power BI', 'Google Analytics', 'A/B Testing', 'ETL Processes'],
            advanced: ['Advanced Statistics', 'Predictive Modeling', 'Machine Learning Basics', 'Big Data Tools', 'Data Warehousing']
        },
        tools: {
            essential: ['Excel', 'SQL', 'Tableau', 'Power BI'],
            recommended: ['Python', 'R', 'Google Data Studio', 'Looker', 'Jupyter Notebook'],
            advanced: ['Apache Spark', 'Snowflake', 'dbt', 'Airflow', 'AWS Redshift']
        },
        soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Problem Solving', 'Data Storytelling', 'Business Acumen']
    }
};

// Get all skills for a career as a flat list
export const getAllSkillsForCareer = (careerName) => {
    const career = careerSkills[careerName];
    if (!career) return [];

    const skills = new Set();

    // Add technical skills
    if (career.technical) {
        Object.values(career.technical).forEach(skillArray => {
            skillArray.forEach(skill => skills.add(skill.toLowerCase()));
        });
    }

    // Add tools
    if (career.tools) {
        Object.values(career.tools).forEach(skillArray => {
            skillArray.forEach(skill => skills.add(skill.toLowerCase()));
        });
    }

    // Add soft skills
    if (career.soft) {
        career.soft.forEach(skill => skills.add(skill.toLowerCase()));
    }

    return Array.from(skills);
};

// Get essential skills only
export const getEssentialSkills = (careerName) => {
    const career = careerSkills[careerName];
    if (!career) return [];

    const skills = new Set();

    if (career.technical?.essential) {
        career.technical.essential.forEach(skill => skills.add(skill));
    }
    if (career.tools?.essential) {
        career.tools.essential.forEach(skill => skills.add(skill));
    }

    return Array.from(skills);
};
