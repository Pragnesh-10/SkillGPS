// Comprehensive project recommendations database for career guidance
// Each career domain has beginner, intermediate, and advanced projects

export const careerProjects = {
    'Data Scientist': {
        beginner: [
            {
                title: "Customer Churn Prediction",
                description: "Build a classification model to predict customer churn using historical data. Learn data preprocessing, feature engineering, and model evaluation.",
                skills: ["Python", "Pandas", "Scikit-learn", "Data Visualization"],
                duration: "1-2 weeks",
                outcomes: ["Binary classification", "Feature engineering", "Model evaluation metrics"]
            },
            {
                title: "Exploratory Data Analysis on E-commerce Dataset",
                description: "Perform comprehensive EDA on online retail data. Create visualizations to uncover sales patterns, customer behavior, and product trends.",
                skills: ["Python", "Pandas", "Matplotlib", "Seaborn"],
                duration: "1 week",
                outcomes: ["Data cleaning", "Statistical analysis", "Data visualization"]
            },
            {
                title: "House Price Prediction",
                description: "Develop a regression model to predict house prices based on features like location, size, and amenities.",
                skills: ["Python", "Scikit-learn", "NumPy", "Data Analysis"],
                duration: "2 weeks",
                outcomes: ["Regression modeling", "Feature selection", "Model optimization"]
            },
            {
                title: "Sales Forecasting Dashboard",
                description: "Create an interactive dashboard to visualize and forecast sales trends using historical data.",
                skills: ["Python", "Pandas", "Plotly", "Streamlit"],
                duration: "2 weeks",
                outcomes: ["Time series basics", "Dashboard creation", "Business insights"]
            },
            {
                title: "COVID-19 Data Analysis",
                description: "Analyze global COVID-19 data to identify trends, create visualizations, and generate insights.",
                skills: ["Python", "Pandas", "Matplotlib", "Data Analysis"],
                duration: "1 week",
                outcomes: ["Data aggregation", "Trend analysis", "Public health insights"]
            }
        ],
        intermediate: [
            {
                title: "Movie Recommendation System",
                description: "Build a collaborative filtering recommendation engine using matrix factorization techniques to suggest movies to users.",
                skills: ["Python", "Scikit-learn", "Pandas", "Surprise Library", "SQL"],
                duration: "3-4 weeks",
                outcomes: ["Collaborative filtering", "Matrix factorization", "Recommendation algorithms"]
            },
            {
                title: "Sentiment Analysis on Social Media",
                description: "Analyze Twitter data to determine sentiment around brands or topics using NLP techniques.",
                skills: ["Python", "NLTK", "TextBlob", "Machine Learning", "API Integration"],
                duration: "2-3 weeks",
                outcomes: ["Natural Language Processing", "Text preprocessing", "Sentiment classification"]
            },
            {
                title: "Credit Card Fraud Detection",
                description: "Develop an anomaly detection system to identify fraudulent credit card transactions in imbalanced datasets.",
                skills: ["Python", "Scikit-learn", "Imbalanced-learn", "Data Preprocessing"],
                duration: "3 weeks",
                outcomes: ["Anomaly detection", "Handling imbalanced data", "Precision-recall tradeoff"]
            },
            {
                title: "A/B Testing Analysis Platform",
                description: "Build a system to design, run, and analyze A/B tests with statistical significance testing.",
                skills: ["Python", "Statistics", "Pandas", "Scipy", "Visualization"],
                duration: "2-3 weeks",
                outcomes: ["Hypothesis testing", "Statistical inference", "Experiment design"]
            },
            {
                title: "Stock Price Forecasting with Time Series",
                description: "Use ARIMA and Prophet models to forecast stock prices based on historical data.",
                skills: ["Python", "Statsmodels", "Prophet", "Time Series Analysis"],
                duration: "3 weeks",
                outcomes: ["Time series modeling", "Forecasting techniques", "Model comparison"]
            }
        ],
        advanced: [
            {
                title: "Real-time Fraud Detection Pipeline",
                description: "Build an end-to-end ML pipeline that detects fraudulent transactions in real-time using streaming data.",
                skills: ["Python", "Apache Kafka", "Apache Spark", "MLOps", "Docker"],
                duration: "4-6 weeks",
                outcomes: ["Stream processing", "Real-time ML", "Production deployment"]
            },
            {
                title: "Computer Vision: Object Detection System",
                description: "Implement a YOLO or Faster R-CNN model to detect and classify objects in images and videos.",
                skills: ["Python", "PyTorch", "TensorFlow", "OpenCV", "Deep Learning"],
                duration: "4-5 weeks",
                outcomes: ["Computer vision", "Deep learning", "Object detection"]
            },
            {
                title: "NLP Chatbot with Intent Recognition",
                description: "Create an intelligent chatbot using transformer models that understands user intents and provides contextual responses.",
                skills: ["Python", "Transformers", "BERT", "NLP", "API Development"],
                duration: "5-6 weeks",
                outcomes: ["Advanced NLP", "Intent classification", "Conversational AI"]
            },
            {
                title: "Automated Feature Engineering Pipeline",
                description: "Build an automated feature engineering system using tools like Featuretools for large-scale datasets.",
                skills: ["Python", "Featuretools", "MLOps", "Data Engineering", "Optimization"],
                duration: "4 weeks",
                outcomes: ["AutoML", "Feature engineering", "Pipeline automation"]
            }
        ]
    },

    'Backend Developer': {
        beginner: [
            {
                title: "RESTful API for Todo Application",
                description: "Create a REST API with CRUD operations for managing tasks. Implement user authentication and data validation.",
                skills: ["Node.js", "Express", "MongoDB", "JWT"],
                duration: "2 weeks",
                outcomes: ["REST API design", "Database operations", "Authentication basics"]
            },
            {
                title: "User Authentication System",
                description: "Build a secure authentication system with registration, login, password reset, and JWT token management.",
                skills: ["Node.js", "Express", "bcrypt", "JWT", "PostgreSQL"],
                duration: "2-3 weeks",
                outcomes: ["Security best practices", "Token-based auth", "Password encryption"]
            },
            {
                title: "Blog Platform API",
                description: "Develop a blog API with posts, comments, categories, and user roles (admin, author, reader).",
                skills: ["Python", "Django", "SQLite", "REST Framework"],
                duration: "2-3 weeks",
                outcomes: ["Database modeling", "API endpoints", "Role-based access"]
            },
            {
                title: "File Upload Service",
                description: "Create a service to upload, store, and retrieve files with metadata tracking and access control.",
                skills: ["Node.js", "Express", "Multer", "Amazon S3", "MongoDB"],
                duration: "1-2 weeks",
                outcomes: ["File handling", "Cloud storage", "Metadata management"]
            },
            {
                title: "Weather API Integration Service",
                description: "Build a backend service that aggregates weather data from multiple APIs and caches results.",
                skills: ["Node.js", "Express", "Redis", "API Integration"],
                duration: "1 week",
                outcomes: ["Third-party APIs", "Caching strategies", "Data aggregation"]
            }
        ],
        intermediate: [
            {
                title: "E-commerce API with Payment Integration",
                description: "Build a complete e-commerce backend with product catalog, shopping cart, and Stripe payment processing.",
                skills: ["Node.js", "Express", "PostgreSQL", "Stripe API", "Redis"],
                duration: "4-5 weeks",
                outcomes: ["Payment processing", "Transaction management", "Inventory control"]
            },
            {
                title: "Real-time Chat Application",
                description: "Create a chat system with WebSocket support for real-time messaging, typing indicators, and online status.",
                skills: ["Node.js", "Socket.io", "MongoDB", "Redis", "WebSockets"],
                duration: "3-4 weeks",
                outcomes: ["Real-time communication", "WebSocket protocol", "Presence system"]
            },
            {
                title: "URL Shortener with Analytics",
                description: "Develop a URL shortening service with click tracking, geographic analytics, and custom short URLs.",
                skills: ["Python", "Flask", "PostgreSQL", "Redis", "Analytics"],
                duration: "2-3 weeks",
                outcomes: ["Short URL generation", "Analytics tracking", "Rate limiting"]
            },
            {
                title: "Job Queue System",
                description: "Implement a background job processing system for email sending, image processing, and scheduled tasks.",
                skills: ["Node.js", "Bull", "Redis", "Worker processes"],
                duration: "3 weeks",
                outcomes: ["Async processing", "Queue management", "Worker pools"]
            },
            {
                title: "Social Media API",
                description: "Build a social network API with friend connections, posts, likes, comments, and activity feeds.",
                skills: ["Node.js", "GraphQL", "MongoDB", "Redis", "API Design"],
                duration: "4-5 weeks",
                outcomes: ["Graph relationships", "Feed algorithms", "GraphQL schema"]
            }
        ],
        advanced: [
            {
                title: "Microservices Architecture for Food Delivery",
                description: "Design and implement a microservices system with separate services for orders, payments, delivery, and notifications.",
                skills: ["Node.js", "Docker", "Kubernetes", "RabbitMQ", "MongoDB", "API Gateway"],
                duration: "6-8 weeks",
                outcomes: ["Microservices design", "Service orchestration", "Distributed systems"]
            },
            {
                title: "GraphQL API with Advanced Caching",
                description: "Build a high-performance GraphQL API with DataLoader, Redis caching, and query optimization.",
                skills: ["Node.js", "GraphQL", "Redis", "PostgreSQL", "DataLoader"],
                duration: "4-5 weeks",
                outcomes: ["GraphQL optimization", "N+1 problem solving", "Caching strategies"]
            },
            {
                title: "Distributed Task Queue System",
                description: "Create a scalable task processing system using message queues, worker pools, and distributed locking.",
                skills: ["Python", "Celery", "RabbitMQ", "Redis", "Distributed Systems"],
                duration: "5-6 weeks",
                outcomes: ["Distributed processing", "Message queues", "Fault tolerance"]
            },
            {
                title: "API Rate Limiting & Throttling System",
                description: "Implement advanced rate limiting with token bucket, sliding window, and distributed rate limiting across servers.",
                skills: ["Node.js", "Redis", "Algorithms", "System Design"],
                duration: "3-4 weeks",
                outcomes: ["Rate limiting algorithms", "Distributed counting", "API protection"]
            }
        ]
    },

    'Frontend Developer': {
        beginner: [
            {
                title: "Portfolio Website",
                description: "Create a responsive portfolio website showcasing your projects with smooth animations and modern design.",
                skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
                duration: "1-2 weeks",
                outcomes: ["Responsive layouts", "CSS animations", "Modern UI"]
            },
            {
                title: "Todo App with Local Storage",
                description: "Build an interactive todo application with add, edit, delete, and filter functionality using local storage.",
                skills: ["React", "JavaScript", "Local Storage", "State Management"],
                duration: "1 week",
                outcomes: ["React basics", "State management", "Browser storage"]
            },
            {
                title: "Weather App",
                description: "Develop a weather application that fetches data from a weather API and displays it with nice UI.",
                skills: ["React", "API Integration", "CSS", "JavaScript"],
                duration: "1-2 weeks",
                outcomes: ["API consumption", "Async operations", "Data display"]
            },
            {
                title: "Recipe Finder Application",
                description: "Create an app to search recipes using a public API with filtering, favorites, and recipe details.",
                skills: ["React", "API Integration", "CSS Modules", "Routing"],
                duration: "2 weeks",
                outcomes: ["Search functionality", "Favorites system", "Routing"]
            }
        ],
        intermediate: [
            {
                title: "E-commerce Product Page",
                description: "Build a fully functional product page with image gallery, size/color selection, cart functionality, and checkout flow.",
                skills: ["React", "Redux", "CSS-in-JS", "Shopping Cart Logic"],
                duration: "3-4 weeks",
                outcomes: ["Complex state management", "Shopping cart", "Product variants"]
            },
            {
                title: "Real-time Dashboard",
                description: "Create an analytics dashboard with charts, real-time updates, and interactive filters using WebSockets.",
                skills: ["React", "Chart.js", "WebSockets", "Data Visualization"],
                duration: "3-4 weeks",
                outcomes: ["Data visualization", "Real-time updates", "Dashboard design"]
            },
            {
                title: "Social Media Feed",
                description: "Build a social media feed with infinite scroll, post interactions (like, comment), and image uploads.",
                skills: ["React", "Infinite Scroll", "File Upload", "API Integration"],
                duration: "4 weeks",
                outcomes: ["Infinite scroll", "Image handling", "Social features"]
            },
            {
                title: "Video Streaming Platform UI",
                description: "Develop a Netflix-like interface with video player, categories, search, and watchlist functionality.",
                skills: ["React", "Video Player", "Complex Layouts", "State Management"],
                duration: "4-5 weeks",
                outcomes: ["Video integration", "Complex UI", "User preferences"]
            }
        ],
        advanced: [
            {
                title: "Collaborative Code Editor",
                description: "Build a real-time collaborative code editor like CodePen with syntax highlighting and live preview.",
                skills: ["React", "WebSockets", "CodeMirror", "Operational Transforms"],
                duration: "5-6 weeks",
                outcomes: ["Real-time collaboration", "Code editing", "Conflict resolution"]
            },
            {
                title: "Progressive Web App (PWA)",
                description: "Create a full-featured PWA with offline support, push notifications, and app-like experience.",
                skills: ["React", "Service Workers", "PWA", "IndexedDB"],
                duration: "4-5 weeks",
                outcomes: ["Offline functionality", "PWA features", "Performance optimization"]
            },
            {
                title: "Design System & Component Library",
                description: "Build a comprehensive design system with reusable components, documentation, and Storybook integration.",
                skills: ["React", "TypeScript", "Storybook", "Design Tokens"],
                duration: "6-8 weeks",
                outcomes: ["Component architecture", "Documentation", "Design systems"]
            }
        ]
    },

    'UI/UX Designer': {
        beginner: [
            {
                title: "Mobile App Redesign",
                description: "Redesign an existing mobile app's UI/UX with modern principles, improved navigation, and better user flow.",
                skills: ["Figma", "UI Design", "Wireframing", "User Flow"],
                duration: "2 weeks",
                outcomes: ["UI redesign", "User flows", "Mobile patterns"]
            },
            {
                title: "Landing Page Design",
                description: "Create a high-converting landing page design with clear CTAs, hero section, and social proof elements.",
                skills: ["Figma", "UI Design", "Typography", "Visual Hierarchy"],
                duration: "1 week",
                outcomes: ["Landing page structure", "Visual hierarchy", "CTA design"]
            },
            {
                title: "Icon Set Design",
                description: "Design a cohesive icon set (50+ icons) for a specific theme or application with consistent style.",
                skills: ["Figma", "Illustrator", "Icon Design", "Grid Systems"],
                duration: "2 weeks",
                outcomes: ["Icon design", "Consistency", "Scalability"]
            }
        ],
        intermediate: [
            {
                title: "E-commerce User Experience",
                description: "Conduct UX research and design a complete e-commerce experience from browsing to checkout.",
                skills: ["Figma", "UX Research", "User Testing", "Prototyping"],
                duration: "4-5 weeks",
                outcomes: ["User research", "E-commerce patterns", "Checkout optimization"]
            },
            {
                title: "Design System Creation",
                description: "Build a complete design system with components, color palette, typography, and usage guidelines.",
                skills: ["Figma", "Design Tokens", "Component Design", "Documentation"],
                duration: "5-6 weeks",
                outcomes: ["Design systems", "Component libraries", "Documentation"]
            },
            {
                title: "Dashboard Interface Design",
                description: "Design a data-heavy dashboard with charts, tables, filters, and responsive layouts for analytics.",
                skills: ["Figma", "Data Visualization", "Dashboard Design", "Information Architecture"],
                duration: "3-4 weeks",
                outcomes: ["Data visualization", "Information density", "Dashboard patterns"]
            }
        ],
        advanced: [
            {
                title: "Complete Product UX Strategy",
                description: "Lead end-to-end UX for a product including research, personas, journey mapping, and high-fidelity prototypes.",
                skills: ["UX Research", "Personas", "Journey Mapping", "Prototyping", "User Testing"],
                duration: "8-10 weeks",
                outcomes: ["UX strategy", "Research methods", "Product thinking"]
            },
            {
                title: "Accessibility-First Application",
                description: "Design an application with WCAG 2.1 AA compliance, keyboard navigation, and screen reader support.",
                skills: ["Accessibility", "WCAG", "Inclusive Design", "Figma"],
                duration: "5-6 weeks",
                outcomes: ["Accessibility standards", "Inclusive design", "Testing"]
            },
            {
                title: "Animation & Microinteraction System",
                description: "Create a comprehensive animation system with motion principles, transitions, and microinteractions.",
                skills: ["Figma", "Principle", "After Effects", "Motion Design"],
                duration: "4-5 weeks",
                outcomes: ["Motion design", "Microinteractions", "Animation principles"]
            }
        ]
    },

    'AI/ML Engineer': {
        beginner: [
            {
                title: "Image Classification with CNN",
                description: "Build a convolutional neural network to classify images into categories using popular datasets like CIFAR-10.",
                skills: ["Python", "TensorFlow", "Keras", "CNN", "Image Processing"],
                duration: "2-3 weeks",
                outcomes: ["Neural networks", "Image classification", "Model training"]
            },
            {
                title: "Text Classification with NLP",
                description: "Create a text classifier for spam detection or sentiment analysis using traditional ML and deep learning.",
                skills: ["Python", "NLTK", "TensorFlow", "Text Processing"],
                duration: "2 weeks",
                outcomes: ["Text preprocessing", "Classification", "NLP basics"]
            },
            {
                title: "Face Detection System",
                description: "Implement face detection using OpenCV and pre-trained models for real-time video processing.",
                skills: ["Python", "OpenCV", "Deep Learning", "Computer Vision"],
                duration: "1-2 weeks",
                outcomes: ["Computer vision", "Pre-trained models", "Real-time processing"]
            }
        ],
        intermediate: [
            {
                title: "Neural Style Transfer",
                description: "Implement artistic style transfer to apply the style of one image to the content of another using CNNs.",
                skills: ["Python", "TensorFlow", "PyTorch", "CNN", "Optimization"],
                duration: "3-4 weeks",
                outcomes: ["Style transfer", "Optimization techniques", "Creative AI"]
            },
            {
                title: "Question Answering System",
                description: "Build a QA system using transformer models like BERT to answer questions based on context.",
                skills: ["Python", "Transformers", "BERT", "NLP", "Fine-tuning"],
                duration: "4-5 weeks",
                outcomes: ["Transformer models", "Transfer learning", "QA systems"]
            },
            {
                title: "Generative Adversarial Network (GAN)",
                description: "Create a GAN to generate realistic images, starting with MNIST and progressing to faces.",
                skills: ["Python", "PyTorch", "GANs", "Deep Learning", "Image Generation"],
                duration: "4-5 weeks",
                outcomes: ["GAN architecture", "Generative models", "Training stability"]
            }
        ],
        advanced: [
            {
                title: "MLOps Pipeline with CI/CD",
                description: "Build an end-to-end MLOps pipeline with model versioning, A/B testing, and automated deployment.",
                skills: ["Python", "MLflow", "Kubernetes", "Docker", "CI/CD", "Model Serving"],
                duration: "6-8 weeks",
                outcomes: ["MLOps practices", "Model deployment", "Production ML"]
            },
            {
                title: "Reinforcement Learning Agent",
                description: "Train an RL agent to play games or solve control problems using deep Q-learning or policy gradients.",
                skills: ["Python", "PyTorch", "Reinforcement Learning", "OpenAI Gym"],
                duration: "5-6 weeks",
                outcomes: ["RL algorithms", "Agent training", "Reward engineering"]
            },
            {
                title: "Large Language Model Fine-tuning",
                description: "Fine-tune GPT or T5 models for specific tasks with custom datasets and optimization techniques.",
                skills: ["Python", "Transformers", "Fine-tuning", "GPU Optimization"],
                duration: "5-7 weeks",
                outcomes: ["LLM fine-tuning", "Optimization", "Custom datasets"]
            }
        ]
    },

    'Product Manager': {
        beginner: [
            {
                title: "Product Requirement Document (PRD)",
                description: "Write a comprehensive PRD for a mobile app feature including user stories, acceptance criteria, and success metrics.",
                skills: ["Documentation", "User Stories", "Product Thinking"],
                duration: "1 week",
                outcomes: ["PRD writing", "User stories", "Requirements gathering"]
            },
            {
                title: "Competitive Analysis Report",
                description: "Conduct competitive analysis on 5 products in a market, identifying strengths, weaknesses, and opportunities.",
                skills: ["Market Research", "Analysis", "Strategic Thinking"],
                duration: "1-2 weeks",
                outcomes: ["Competitive analysis", "Market understanding", "Strategic insights"]
            },
            {
                title: "Product Roadmap Creation",
                description: "Develop a 6-month product roadmap with prioritized features, timelines, and dependencies.",
                skills: ["Roadmapping", "Prioritization", "Strategic Planning"],
                duration: "1 week",
                outcomes: ["Roadmap planning", "Feature prioritization", "Timeline estimation"]
            }
        ],
        intermediate: [
            {
                title: "Go-to-Market Strategy",
                description: "Create a complete GTM plan for a new product including positioning, pricing, channels, and launch timeline.",
                skills: ["Strategy", "Marketing", "Pricing", "Launch Planning"],
                duration: "3-4 weeks",
                outcomes: ["GTM strategy", "Market positioning", "Launch execution"]
            },
            {
                title: "A/B Testing Framework",
                description: "Design and implement an A/B testing program including hypothesis, experiment design, and analysis framework.",
                skills: ["A/B Testing", "Analytics", "Statistics", "Data Analysis"],
                duration: "3 weeks",
                outcomes: ["Experiment design", "Statistical analysis", "Data-driven decisions"]
            },
            {
                title: "Product Metrics Dashboard",
                description: "Build a metrics dashboard tracking key product KPIs with SQL queries and visualization tools.",
                skills: ["SQL", "Analytics", "Tableau", "Data Visualization"],
                duration: "2-3 weeks",
                outcomes: ["Metrics definition", "SQL analytics", "Dashboard design"]
            }
        ],
        advanced: [
            {
                title: "Product Strategy for Market Expansion",
                description: "Develop a comprehensive strategy to expand product into new markets or verticals with detailed execution plan.",
                skills: ["Strategy", "Market Research", "Business Planning", "Stakeholder Management"],
                duration: "6-8 weeks",
                outcomes: ["Strategic planning", "Market expansion", "Business case development"]
            },
            {
                title: "Product-Led Growth Implementation",
                description: "Design and execute a PLG strategy with viral loops, onboarding optimization, and activation metrics.",
                skills: ["Growth Strategy", "Analytics", "User Psychology", "Experimentation"],
                duration: "5-6 weeks",
                outcomes: ["PLG principles", "Growth tactics", "Conversion optimization"]
            }
        ]
    },

    'Cybersecurity Analyst': {
        beginner: [
            {
                title: "Network Traffic Analysis Lab",
                description: "Set up a lab environment to capture and analyze network traffic using Wireshark, identifying suspicious patterns.",
                skills: ["Wireshark", "Network Protocols", "Traffic Analysis"],
                duration: "1-2 weeks",
                outcomes: ["Packet analysis", "Protocol understanding", "Threat detection"]
            },
            {
                title: "Vulnerability Scanner Project",
                description: "Use tools like Nmap and Nessus to scan networks for vulnerabilities and create remediation reports.",
                skills: ["Nmap", "Vulnerability Scanning", "Report Writing"],
                duration: "2 weeks",
                outcomes: ["Vulnerability assessment", "Scanning tools", "Documentation"]
            },
            {
                title: "Password Security Analyzer",
                description: "Build a tool to analyze password strength and check against common password databases.",
                skills: ["Python", "Security", "Hashing", "Password Policies"],
                duration: "1 week",
                outcomes: ["Password security", "Hashing algorithms", "Tool development"]
            }
        ],
        intermediate: [
            {
                title: "Web Application Penetration Testing",
                description: "Perform comprehensive penetration testing on web applications using OWASP Top 10 vulnerabilities.",
                skills: ["Burp Suite", "OWASP", "SQL Injection", "XSS", "Security Testing"],
                duration: "4-5 weeks",
                outcomes: ["Penetration testing", "Web vulnerabilities", "Exploitation techniques"]
            },
            {
                title: "SIEM Implementation & Monitoring",
                description: "Deploy and configure a SIEM solution like Splunk to collect, analyze, and alert on security events.",
                skills: ["Splunk", "Log Analysis", "Alert Rules", "Incident Response"],
                duration: "3-4 weeks",
                outcomes: ["SIEM setup", "Log correlation", "Alert tuning"]
            },
            {
                title: "Malware Analysis Sandbox",
                description: "Set up a malware analysis lab to safely analyze suspicious files and understand their behavior.",
                skills: ["Malware Analysis", "Virtual Machines", "Reverse Engineering"],
                duration: "3-4 weeks",
                outcomes: ["Malware behavior", "Analysis tools", "Safe analysis environment"]
            }
        ],
        advanced: [
            {
                title: "Threat Hunting Platform",
                description: "Build an automated threat hunting system using machine learning to detect advanced persistent threats.",
                skills: ["Python", "Machine Learning", "Threat Intelligence", "SIEM", "Automation"],
                duration: "6-8 weeks",
                outcomes: ["Threat hunting", "Advanced detection", "Automation"]
            },
            {
                title: "Incident Response Automation",
                description: "Create automated incident response playbooks using SOAR tools for common security incidents.",
                skills: ["SOAR", "Automation", "Incident Response", "Scripting"],
                duration: "5-6 weeks",
                outcomes: ["IR automation", "Playbook development", "SOAR integration"]
            },
            {
                title: "Cloud Security Architecture",
                description: "Design and implement comprehensive security architecture for multi-cloud environments.",
                skills: ["AWS Security", "Azure Security", "Cloud Architecture", "IAM", "Compliance"],
                duration: "6-8 weeks",
                outcomes: ["Cloud security", "Multi-cloud", "Compliance frameworks"]
            }
        ]
    },

    'Cloud Engineer': {
        beginner: [
            {
                title: "Static Website Hosting on AWS",
                description: "Deploy a static website using S3, CloudFront CDN, and Route 53 for DNS management.",
                skills: ["AWS S3", "CloudFront", "Route 53", "Static Hosting"],
                duration: "1 week",
                outcomes: ["AWS basics", "CDN configuration", "DNS management"]
            },
            {
                title: "EC2 Web Server Deployment",
                description: "Launch and configure EC2 instances with web servers, security groups, and load balancers.",
                skills: ["AWS EC2", "Linux", "Security Groups", "Load Balancers"],
                duration: "2 weeks",
                outcomes: ["EC2 management", "Security configuration", "High availability"]
            },
            {
                title: "Infrastructure as Code with Terraform",
                description: "Write Terraform configurations to provision cloud resources automatically and manage state.",
                skills: ["Terraform", "IaC", "AWS", "Version Control"],
                duration: "2-3 weeks",
                outcomes: ["Infrastructure as Code", "Terraform basics", "Resource management"]
            }
        ],
        intermediate: [
            {
                title: "Containerized Application Deployment",
                description: "Deploy a multi-container application using Docker and Kubernetes with persistent storage.",
                skills: ["Docker", "Kubernetes", "Container Orchestration", "Helm"],
                duration: "4-5 weeks",
                outcomes: ["Container orchestration", "Kubernetes", "Service deployment"]
            },
            {
                title: "CI/CD Pipeline with Jenkins",
                description: "Build automated CI/CD pipelines for application deployment to cloud environments.",
                skills: ["Jenkins", "CI/CD", "Docker", "AWS", "Automation"],
                duration: "3-4 weeks",
                outcomes: ["Pipeline automation", "Continuous deployment", "DevOps practices"]
            },
            {
                title: "Serverless Application Architecture",
                description: "Create a serverless application using AWS Lambda, API Gateway, and DynamoDB.",
                skills: ["AWS Lambda", "API Gateway", "DynamoDB", "Serverless"],
                duration: "3-4 weeks",
                outcomes: ["Serverless architecture", "Event-driven design", "Cost optimization"]
            }
        ],
        advanced: [
            {
                title: "Multi-Cloud Kubernetes Cluster",
                description: "Deploy and manage Kubernetes clusters across AWS, Azure, and GCP with centralized monitoring.",
                skills: ["Kubernetes", "Multi-cloud", "Terraform", "Monitoring", "Service Mesh"],
                duration: "6-8 weeks",
                outcomes: ["Multi-cloud strategy", "Cluster federation", "Advanced orchestration"]
            },
            {
                title: "Cloud Cost Optimization System",
                description: "Build an automated system to analyze, optimize, and report on cloud spending across services.",
                skills: ["Cloud Economics", "AWS Cost Explorer", "Automation", "FinOps"],
                duration: "5-6 weeks",
                outcomes: ["Cost optimization", "Resource right-sizing", "FinOps practices"]
            },
            {
                title: "Disaster Recovery Architecture",
                description: "Design and implement complete DR solution with automated failover and backup strategies.",
                skills: ["High Availability", "Disaster Recovery", "Backup Strategies", "Multi-region"],
                duration: "6-8 weeks",
                outcomes: ["DR planning", "Failover automation", "Business continuity"]
            }
        ]
    },

    'Business Analyst': {
        beginner: [
            {
                title: "Business Process Documentation",
                description: "Document existing business processes using BPMN diagrams and identify improvement opportunities.",
                skills: ["Process Modeling", "BPMN", "Documentation", "Analysis"],
                duration: "2 weeks",
                outcomes: ["Process mapping", "Documentation skills", "Improvement identification"]
            },
            {
                title: "Requirements Gathering for CRM System",
                description: "Conduct stakeholder interviews and create requirements document for CRM implementation.",
                skills: ["Requirements Gathering", "Stakeholder Management", "Documentation"],
                duration: "2-3 weeks",
                outcomes: ["Elicitation techniques", "Requirement documentation", "Stakeholder communication"]
            },
            {
                title: "Sales Data Analysis Dashboard",
                description: "Create Excel or Power BI dashboard analyzing sales trends, patterns, and performance metrics.",
                skills: ["Excel", "Power BI", "Data Analysis", "Visualization"],
                duration: "2 weeks",
                outcomes: ["Data analysis", "Dashboard creation", "Business insights"]
            }
        ],
        intermediate: [
            {
                title: "Gap Analysis & Solution Design",
                description: "Conduct gap analysis between current and desired state, propose solutions with cost-benefit analysis.",
                skills: ["Gap Analysis", "Solution Design", "Cost-Benefit Analysis", "Business Case"],
                duration: "3-4 weeks",
                outcomes: ["Analysis techniques", "Solution evaluation", "Business case development"]
            },
            {
                title: "Customer Segmentation Analysis",
                description: "Use SQL and Python to segment customers based on behavior and create targeted strategies.",
                skills: ["SQL", "Python", "Data Analysis", "Segmentation", "Statistics"],
                duration: "3-4 weeks",
                outcomes: ["Customer analytics", "Segmentation techniques", "Data-driven insights"]
            },
            {
                title: "Process Optimization Project",
                description: "Analyze inefficient business process, design improved workflow, and measure impact after implementation.",
                skills: ["Process Improvement", "Lean", "Change Management", "Metrics"],
                duration: "4-5 weeks",
                outcomes: ["Process optimization", "Change management", "Impact measurement"]
            }
        ],
        advanced: [
            {
                title: "Predictive Analytics for Business Forecasting",
                description: "Build predictive models for sales forecasting, demand planning, or customer churn using advanced analytics.",
                skills: ["Python", "Machine Learning", "Statistical Modeling", "Forecasting"],
                duration: "6-8 weeks",
                outcomes: ["Predictive analytics", "Statistical modeling", "Business forecasting"]
            },
            {
                title: "Enterprise System Integration Strategy",
                description: "Design integration strategy for connecting multiple enterprise systems with data flow architecture.",
                skills: ["System Integration", "Enterprise Architecture", "Data Modeling", "API Design"],
                duration: "5-6 weeks",
                outcomes: ["Integration architecture", "Data flows", "System design"]
            }
        ]
    }
};

// Helper function to get all projects for a career
export const getAllProjectsForCareer = (careerName) => {
    const career = careerProjects[careerName];
    if (!career) return [];

    return {
        beginner: career.beginner || [],
        intermediate: career.intermediate || [],
        advanced: career.advanced || []
    };
};

// Helper function to get projects filtered by difficulty
export const getProjectsByDifficulty = (careerName, difficulty) => {
    const career = careerProjects[careerName];
    if (!career || !career[difficulty]) return [];

    return career[difficulty];
};
