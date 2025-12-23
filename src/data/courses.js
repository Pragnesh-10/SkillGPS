export const courses = {
    'Data Scientist': {
        beginner: [
            { title: 'Python for Data Science', platform: 'Coursera', duration: '20h', rating: 4.8, outcome: 'Python Basics, Pandas, NumPy' },
            { title: 'Intro to SQL', platform: 'Udemy', duration: '12h', rating: 4.6, outcome: 'Querying Databases' },
            { title: 'Statistics 101', platform: 'Udacity', duration: '15h', rating: 4.7, outcome: 'Probability & Distributions' }
        ],
        intermediate: [
            { title: 'Machine Learning A-Z', platform: 'Udemy', duration: '40h', rating: 4.8, outcome: 'Regression, Classification, Clustering' },
            { title: 'Data Visualization with Tableau', platform: 'Coursera', duration: '25h', rating: 4.5, outcome: 'Dashboards & Storytelling' }
        ],
        advanced: [
            { title: 'Deep Learning Specialization', platform: 'Coursera', duration: '60h', rating: 4.9, outcome: 'Neural Networks, CNNs, RNNs' },
            { title: 'MLOps: Model Deployment', platform: 'Udacity', duration: '30h', rating: 4.7, outcome: 'Productionizing ML Models' }
        ]
    },
    'Backend Developer': {
        beginner: [
            { title: 'Node.js Basics', platform: 'Udemy', duration: '15h', rating: 4.7, outcome: 'Express, REST APIs' },
            { title: 'Database Design', platform: 'Coursera', duration: '20h', rating: 4.5, outcome: 'SQL, NoSQL, Schema Design' }
        ],
        intermediate: [
            { title: 'Advanced Backend Architecture', platform: 'Udacity', duration: '35h', rating: 4.8, outcome: 'Microservices, Caching, Queues' }
        ],
        advanced: [
            { title: 'System Design Interview', platform: 'Udemy', duration: '20h', rating: 4.9, outcome: 'Scalability, Load Balancing' }
        ]
    },
    // Default fallback for other domains
    'default': {
        beginner: [
            { title: 'Domain Fundamentals', platform: 'Coursera', duration: '10h', rating: 4.5, outcome: 'Core Concepts' }
        ],
        intermediate: [
            { title: 'Practical Application', platform: 'Udemy', duration: '20h', rating: 4.6, outcome: 'Real-world Projects' }
        ],
        advanced: [
            { title: 'Mastery & Leadership', platform: 'Udacity', duration: '30h', rating: 4.8, outcome: 'Expert Level Skills' }
        ]
    }
};
