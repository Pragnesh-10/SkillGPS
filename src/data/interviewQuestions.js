export const interviewQuestions = {
    "Data Scientist": [
        {
            question: "What is the difference between supervised and unsupervised learning?",
            answer: "Supervised learning uses labeled data to train models (e.g., classification, regression), whereas unsupervised learning deals with unlabeled data (e.g., clustering, dimensionality reduction).",
            explanation: "In supervised learning, the algorithm learns from example input-output pairs. In unsupervised learning, the algorithm finds patterns or structure in the data without explicit instructions."
        },
        {
            question: "Explain the concept of overfitting and how to prevent it.",
            answer: "Overfitting occurs when a model learns the training data too well, including noise, negatively impacting performance on new data. Prevention includes cross-validation, regularization (L1/L2), pruning (trees), and dropout (neural networks).",
            explanation: "A model that is overfitted has high variance and low bias. It captures random fluctuations in the training data."
        },
        {
            question: "What is the purpose of A/B testing?",
            answer: "A/B testing is a statistical hypothesis testing process where two variants (A and B) are compared to determine which one performs better for a given conversion goal.",
            explanation: "It helps in making data-driven decisions by isolating the impact of specific changes."
        },
        {
            question: "What is the curse of dimensionality?",
            answer: "It refers to various phenomena that arise when analyzing and organizing data in high-dimensional spaces, where the volume of the space increases so fast that the available data becomes sparse.",
            explanation: "This often makes model training difficult and increases computational complexity."
        },
        {
            question: "Explain the difference between L1 and L2 regularization.",
            answer: "L1 (Lasso) adds the absolute value of magnitude of coefficient as penalty term to loss function. L2 (Ridge) adds squared magnitude of coefficient as penalty term.",
            explanation: "L1 encourages sparsity (feature selection), while L2 encourages small weights."
        },
        {
            question: "What is a confusion matrix?",
            answer: "A table used to evaluate the performance of a classification model, highlighting true positives, true negatives, false positives, and false negatives.",
            explanation: "It allows you to calculate metrics like accuracy, precision, recall, and F1-score."
        },
        {
            question: "What is the ROC curve?",
            answer: "A graphical plot that illustrates the diagnostic ability of a binary classifier system as its discrimination threshold is varied.",
            explanation: "It plots the true positive rate (TPR) against the false positive rate (FPR)."
        },
        {
            question: "Explain Random Forest.",
            answer: "An ensemble learning method that constructs a multitude of decision trees at training time and outputs the class that is the mode of the classes (classification) or mean prediction (regression) of the individual trees.",
            explanation: "It reduces overfitting by averaging the results of varying subsets of trees."
        },
        {
            question: "What is the difference between bagging and boosting?",
            answer: "Bagging (Bootstrap Aggregating) trains models in parallel on different subsets of data to reduce variance. Boosting trains models sequentially, where each new model corrects errors of the previous ones to reduce bias.",
            explanation: "Random Forest is a bagging technique; AdaBoost and Gradient Boosting are boosting techniques."
        },
        {
            question: "What is Gradient Descent?",
            answer: "An optimization algorithm used to minimize some function by iteratively moving in the direction of steepest descent as defined by the negative of the gradient.",
            explanation: "It is the backbone of training neural networks and many other ML algorithms."
        },
        {
            question: "What is PCA (Principal Component Analysis)?",
            answer: "A dimensionality reduction technique that transforms a large set of variables into a smaller one that still contains most of the information in the large set.",
            explanation: "It does this by finding new uncorrelated variables (principal components) that maximize variance."
        },
        {
            question: "Explain the Bias-Variance Tradeoff.",
            answer: "The problem of simultaneously minimizing two sources of error that prevent supervised learning algorithms from generalizing beyond their training set.",
            explanation: "High bias causes underfitting; high variance causes overfitting. The goal is to find the optimal balance."
        },
        {
            question: "What are support vectors in SVM?",
            answer: "The data points that lie closest to the decision surface (or hyperplane).",
            explanation: "They are the most difficult data points to classify and have a direct bearing on the optimum location of the decision surface."
        },
        {
            question: "What is Cross-Validation?",
            answer: "A resampling procedure used to evaluate machine learning models on a limited data sample.",
            explanation: "K-Fold Cross-Validation splits the data into K subsets and trains/tests K times to ensure robust performance estimation."
        },
        {
            question: "What is the difference between Type I and Type II errors?",
            answer: "Type I error is a False Positive (rejecting a true null hypothesis). Type II error is a False Negative (failing to reject a false null hypothesis).",
            explanation: "Think of Type I as valid user flagged as spam, and Type II as spam reaching the inbox."
        },
        {
            question: "What is Deep Learning?",
            answer: "A subset of machine learning based on artificial neural networks with representation learning.",
            explanation: "It allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction."
        },
        {
            question: "What are activation functions?",
            answer: "Mathematical equations that determine the output of a neural network model. Examples: ReLU, Sigmoid, Tanh.",
            explanation: "They introduce non-linearity into the network, allowing it to learn complex patterns."
        },
        {
            question: "Explain the difference between K-Means and KNN.",
            answer: "K-Means is an unsupervised clustering algorithm. KNN (K-Nearest Neighbors) is a supervised classification/regression algorithm.",
            explanation: "K-Means groups data; KNN predicts labels based on neighbors."
        },
        {
            question: "What is Reinforcement Learning?",
            answer: "A type of ML where an agent learns to make decisions by performing actions in an environment and receiving rewards or penalties.",
            explanation: "It is used in robotics, game playing (AlphaGo), and autonomous driving."
        },
        {
            question: "What is NLP (Natural Language Processing)?",
            answer: "A subfield of AI focused on the interaction between computers and humans through natural language.",
            explanation: "Applications include sentiment analysis, translation, chatbots, and speech recognition."
        },
        {
            question: "What is Transfer Learning?",
            answer: "A technique where a model developed for a task is reused as the starting point for a model on a second task.",
            explanation: "It saves training time and requires less data for the new task."
        },
        {
            question: "What is SQL?",
            answer: "Structured Query Language, a domain-specific language used in programming and designed for managing data held in a relational database management system.",
            explanation: "Essential for data retrieval and manipulation in Data Science."
        },
        {
            question: "What is a p-value?",
            answer: "The probability of obtaining test results at least as extreme as the results actually observed, under the assumption that the null hypothesis is correct.",
            explanation: "A low p-value (typically < 0.05) indicates that the null hypothesis is unlikely to be true."
        },
        {
            question: "What is Data Cleaning?",
            answer: "The process of fixing or removing incorrect, corrupted, incorrectly formatted, duplicate, or incomplete data within a dataset.",
            explanation: "It is often considered the most time-consuming part of data science but is crucial for model accuracy."
        },
        {
            question: "What defines a 'Big Data' problem?",
            answer: "Typically characterized by the 3 Vs: Volume (amount), Velocity (speed), and Variety (types) of data.",
            explanation: "Traditional data processing software is inadequate to deal with them."
        },
        {
            question: "What is One-Hot Encoding?",
            answer: "A process of converting categorical data variables so they can be provided to machine learning algorithms to improve prediction.",
            explanation: "It creates a new binary column for each category."
        },
        {
            question: "Explain the difference between Batch and Stochastic Gradient Descent.",
            answer: "Batch GD computes the gradient using the whole dataset. Stochastic GD (SGD) computes it using a single sample.",
            explanation: "SGD is faster but noisier; Batch is stable but computationally expensive."
        },
        {
            question: "What is an Epoch in training?",
            answer: "One complete pass of the training dataset through the algorithm.",
            explanation: "Training usually requires multiple epochs to reach convergence."
        },
        {
            question: "What is a Hyperparameter?",
            answer: "A configuration variable that is external to the model and whose value cannot be estimated from data.",
            explanation: "Examples: Learning rate, Number of hidden layers, K in K-Means."
        },
        {
            question: "What is the Box-Cox Transformation?",
            answer: "A statistical technique used to transform non-normal dependent variables into a normal shape.",
            explanation: "Normality is an important assumption for many statistical techniques."
        }
    ],
    "Backend Developer": [
        {
            question: "What is the difference between REST and GraphQL?",
            answer: "REST is an architectural style using standard HTTP methods. GraphQL is a query language allowing clients to request specific data.",
            explanation: "REST may over-fetch; GraphQL fetches exactly what is asked."
        },
        {
            question: "Explain the CAP theorem.",
            answer: "States that a distributed data store can only provide two of the three guarantees: Consistency, Availability, and Partition tolerance.",
            explanation: "You prioritize based on system needs (e.g., CP vs AP)."
        },
        {
            question: "What is a database transaction?",
            answer: "A unit of work that must satisfy ACID properties (Atomicity, Consistency, Isolation, Durability).",
            explanation: "Ensures data validity despite errors or crashes."
        },
        {
            question: "What is Microservices Architecture?",
            answer: "An architectural style that structures an application as a collection of loosely coupled services.",
            explanation: "Improves modularity and parallel development but adds complexity in deployment and communication."
        },
        {
            question: "What is the difference between SQL and NoSQL?",
            answer: "SQL databases are relational and table-based. NoSQL databases are non-relational and can be document, key-value, or graph-based.",
            explanation: "SQL is better for complex queries/transactions; NoSQL is better for scalability and flexible schemas."
        },
        {
            question: "What is an API Gateway?",
            answer: "A server that acts as an API front-end, receiving API requests, enforcing throttling and security policies, passing requests to the back-end service, and then passing the response back to the requester.",
            explanation: "It simplifies the client-side interaction with microservices."
        },
        {
            question: "What is Dependency Injection?",
            answer: "A design pattern in which an object or function receives other objects or functions that it depends on.",
            explanation: "It promotes loose coupling and easier testing."
        },
        {
            question: "Explain the concept of Middleware.",
            answer: "Software that provides common services and capabilities to applications outside the operating system. In web frameworks, it catches requests before they reach the final route handler.",
            explanation: "Used for logging, authentication, error handling, etc."
        },
        {
            question: "What is Database Normalization?",
            answer: "The process of organizing data in a database to reduce redundancy and improve data integrity.",
            explanation: "Common forms are 1NF, 2NF, 3NF."
        },
        {
            question: "What is Redis used for?",
            answer: "An in-memory data structure store, used as a database, cache, and message broker.",
            explanation: "It is extremely fast and useful for caching frequent queries or session management."
        },
        {
            question: "What is Docker?",
            answer: "A platform for developing, shipping, and running applications in containers.",
            explanation: "Containers package code and dependencies together, ensuring consistency across environments."
        },
        {
            question: "What is CI/CD?",
            answer: "Continuous Integration and Continuous Delivery/Deployment. A method to frequently deliver apps to customers by introducing automation into the stages of app development.",
            explanation: "It involves automated testing and deployment pipelines."
        },
        {
            question: "What is OAuth?",
            answer: "An open standard for access delegation, commonly used as a way for Internet users to grant websites or applications access to their information on other websites but without giving them the passwords.",
            explanation: "Used for 'Log in with Google/Facebook'."
        },
        {
            question: "What is a WebSocker?",
            answer: "A computer communications protocol, providing full-duplex communication channels over a single TCP connection.",
            explanation: "Used for real-time applications like chat apps or live notifications."
        },
        {
            question: "Explain JWT (JSON Web Token).",
            answer: "A compact, URL-safe means of representing claims to be transferred between two parties.",
            explanation: "Commonly used for stateless authentication."
        },
        {
            question: "What is Horizontal vs Vertical Scaling?",
            answer: "Vertical scaling (scaling up) means adding more power (CPU, RAM) to an existing machine. Horizontal scaling (scaling out) means adding more machines to the pool of resources.",
            explanation: "Horizontal is preferred for distributed systems."
        },
        {
            question: "What is an Index in a database?",
            answer: "A data structure that improves the speed of data retrieval operations on a database table.",
            explanation: "It comes at the cost of additional writes and storage space."
        },
        {
            question: "What is latency vs throughput?",
            answer: "Latency is the time it takes for a single request to process. Throughput is the number of requests a system can handle per unit of time.",
            explanation: "You want low latency and high throughput."
        },
        {
            question: "What is load balancing?",
            answer: "Distributing network traffic across a group of servers to ensure no single server bears too much demand.",
            explanation: "Improves responsiveness and availability."
        },
        {
            question: "What is a Message Queue?",
            answer: "A form of asynchronous service-to-service communication used in serverless and microservices architectures.",
            explanation: "Examples: RabbitMQ, Apache Kafka, AWS SQS."
        },
        {
            question: "What is Unit Testing?",
            answer: "A software testing method where individual units or components of a software are tested.",
            explanation: "Ensures that each part of the code performs as expected."
        },
        {
            question: "What is ORM?",
            answer: "Object-Relational Mapping. A technique for converting data between incompatible type systems using object-oriented programming languages.",
            explanation: "Examples: Hibernate, Sequelize, Prisma."
        },
        {
            question: "What is Concurrency vs Parallelism?",
            answer: "Concurrency is dealing with a lot of things at once (time-slicing). Parallelism is doing a lot of things at once (multiple CPUs).",
            explanation: "Node.js is concurrent; Go often uses parallelism."
        },
        {
            question: "What is a Race Condition?",
            answer: "An undesirable situation where a system attempts to perform two or more operations at the same time, but finds the result depends on the sequence of execution.",
            explanation: "Locking mechanisms are used to prevent this."
        },
        {
            question: "What is Serverless Computing?",
            answer: "A cloud computing execution model where the cloud provider runs the server, and dynamically manages the allocation of machine resources.",
            explanation: "Developers simply deploy code (functions) without provisioning servers (e.g., AWS Lambda)."
        },
        {
            question: "What is Forward Proxy vs Reverse Proxy?",
            answer: "Forward proxy acts on behalf of clients (to access the web). Reverse proxy acts on behalf of servers (to handle client requests).",
            explanation: "Reverse proxies are used for load balancing and security."
        },
        {
            question: "What is sharding?",
            answer: "A type of database partitioning that separates very large databases the into smaller, faster, more easily managed parts called data shards.",
            explanation: "Horizontal scaling method for databases."
        },
        {
            question: "What makes a RESTful API 'Stateless'?",
            answer: "The server does not keep a session state between requests. Every request must contain all necessary information.",
            explanation: "Improves scalability as any server can handle any request."
        },
        {
            question: "What is Blue-Green Deployment?",
            answer: "A deployment strategy utilizing two identical environments, one running the current version (Blue) and one running the new version (Green).",
            explanation: "Traffic is switched from Blue to Green once testing is complete, minimizing downtime."
        },
        {
            question: "What is a Dead Letter Queue (DLQ)?",
            answer: "A service implementation to store messages that meet one or more failure criteria, such as exceeding the max retry count.",
            explanation: "Allows for analysis of failed messages without blocking the main queue."
        }
    ],
    "UI/UX Designer": [
        {
            question: "What is the difference between UI and UX?",
            answer: "UI is the visual interface; UX is the overall user experience.",
            explanation: "UI = Look; UX = Feel."
        },
        {
            question: "Why is accessibility important?",
            answer: "Ensures products are usable by people with disabilities.",
            explanation: "Expands user base and meets legal/ethical standards."
        },
        {
            question: "What is a wireframe?",
            answer: "Low-fidelity blueprint of the interface.",
            explanation: "Focuses on layout without design details."
        },
        {
            question: "What is a prototype?",
            answer: "An interactive representation of the final product.",
            explanation: "Used for user testing and stakeholder approval."
        },
        {
            question: "Define 'User Persona'.",
            answer: "A fictional character created to represent a user type.",
            explanation: "Helps designers understand user needs and behaviors."
        },
        {
            question: "What is White Space?",
            answer: "The empty space around elements in a design layout.",
            explanation: " Improves readability and focus; prevents clutter."
        },
        {
            question: "What is Responsive Design?",
            answer: "Designing web pages that render well on all devices and screen sizes.",
            explanation: "Uses flexible grids and media queries."
        },
        {
            question: "What is a Heatmap?",
            answer: "A data visualization tool that shows how users interact with a page.",
            explanation: "Hot areas show high engagement; cold areas show low."
        },
        {
            question: "What is A/B Testing in Design?",
            answer: "Comparing two versions of a design to see which performs better.",
            explanation: "Quantitative way to validate design decisions."
        },
        {
            question: "What is Color Theory?",
            answer: "The science and art of using color.",
            explanation: "Includes color wheel, harmony, and psychological effects."
        },
        {
            question: "What is Card Sorting?",
            answer: "A method used to help design or evaluate the information architecture of a site.",
            explanation: "Users organize topics into categories that make sense to them."
        },
        {
            question: "What is Usability Testing?",
            answer: "Evaluating a product by testing it on users.",
            explanation: " observing users as they attempt to complete tasks."
        },
        {
            question: "What is a Design System?",
            answer: "A collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.",
            explanation: "Ensures consistency and efficiency."
        },
        {
            question: "What is Affordance?",
            answer: "A property of an object that defines its possible uses or makes clear how it can be used.",
            explanation: "A button having a shadow or 3D look affords 'clicking'."
        },
        {
            question: "What is Fitt's Law?",
            answer: "Predicts that the time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target.",
            explanation: "Make important buttons large and close to the cursor."
        },
        {
            question: "What is Jacob's Law?",
            answer: "Users spend most of their time on other sites, so they prefer your site to work the same way as all the other sites they already know.",
            explanation: "Don't reinvent the wheel for common patterns."
        },
        {
            question: "What is the 'Fold'?",
            answer: "The bottom edge of the screen that separates the visible content from the content that requires scrolling.",
            explanation: "Important content should generally be 'above the fold'."
        },
        {
            question: "What is Typography?",
            answer: "The art and technique of arranging type to make written language legible, readable, and appealing.",
            explanation: "Includes font choice, size, spacing, and weight."
        },
        {
            question: "What is Contrast Ratio?",
            answer: "The difference in light intensity between the foreground (text) and background.",
            explanation: "Crucial for readability and accessibility (WCAG standards)."
        },
        {
            question: "What is Micro-interaction?",
            answer: "Small, single-purpose events in simple interfaces.",
            explanation: "Example: The 'Like' animation, or pull-to-refresh."
        },
        {
            question: "What is Breadcrumb navigation?",
            answer: "A secondary navigation scheme that reveals the user's location in a website or web application.",
            explanation: "e.g., Home > Products > Shoes."
        },
        {
            question: "What is Infinite Scroll vs Pagination?",
            answer: "Infinite scroll loads more content as you scroll down. Pagination divides content into separate pages.",
            explanation: "Infinite scroll is good for exploration (feeds); Pagination is good for finding specific items."
        },
        {
            question: "What is Information Architecture (IA)?",
            answer: "Organization and labeling of websites and software to support usability and findability.",
            explanation: "Structuring content logically."
        },
        {
            question: "What is a User Journey Map?",
            answer: "A visualization of the process that a person goes through in order to accomplish a goal.",
            explanation: "Captures touchpoints and emotions."
        },
        {
            question: "What is Material Design?",
            answer: "A design language developed by Google.",
            explanation: "Uses grid-based layouts, responsive animations and transitions, padding, and depth effects."
        },
        {
            question: "What is Skeuomorphism?",
            answer: "A design concept of making items represented resemble their real-world counterparts.",
            explanation: "e.g., A trash can icon looking like a real bin. Often contrasted with Flat Design."
        },
        {
            question: "What is Rule of Thirds?",
            answer: "A composition guideline that proposes an image should be imagined as divided into nine equal parts, with important elements placed along these lines or intersections.",
            explanation: "Creates more tension, energy, and interest than simply centering the subject."
        },
        {
            question: "What is the 'Golden Ratio' in design?",
            answer: "A mathematical ratio (approx 1.618) often found in nature that is believed to create aesthetically pleasing compositions.",
            explanation: "Used to determine size relationships and layout."
        },
        {
            question: "What is an Empty State?",
            answer: "What the user sees when there is no data to display (e.g., empty inbox, first login).",
            explanation: "Good opportunity to educate the user or guide them to action."
        },
        {
            question: "What is Gamification in UX?",
            answer: "Integrating game mechanics (points, badges, leaderboards) into non-game environments to increase engagement.",
            explanation: "Taps into human psychology of reward and competition."
        }
    ],
    "Frontend Developer": [
        {
            question: "What is the Virtual DOM in React?",
            answer: "Lightweight copy of real DOM. React updates it first, then syncs changes to real DOM.",
            explanation: "Improves performance by minimizing direct DOM manipulation."
        },
        {
            question: "Difference between 'var', 'let', and 'const'.",
            answer: "var: function-scoped, hoisted. let: block-scoped. const: block-scoped, immutable reference.",
            explanation: "Use const by default, let for variables that change."
        },
        {
            question: "What is the Box Model?",
            answer: "Consists of Content, Padding, Border, Margin.",
            explanation: "Basis of CSS layout."
        },
        {
            question: "What is JSX?",
            answer: "Syntax extension for JavaScript, allowing you to write HTML-like code within JS.",
            explanation: "Compiles to React.createElement calls."
        },
        {
            question: "Explain the React Component Lifecycle.",
            answer: "Mounting, Updating, Unmounting. (Hooks equivalent: useEffect).",
            explanation: "Knowing when code runs is crucial for data fetching and cleanup."
        },
        {
            question: "What is a Closure in JS?",
            answer: "A function bundled together with its lexical environment.",
            explanation: "Allows a function to access variables from an outer function even after the outer function has returned."
        },
        {
            question: "What is Event Bubbling?",
            answer: "When an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors.",
            explanation: "Calculated from target up to window."
        },
        {
            question: "What is Redux?",
            answer: "A predictable state container for JavaScript apps.",
            explanation: "Uses a single store and actions/reducers to manage state."
        },
        {
            question: "What are React Hooks?",
            answer: "Functions that let you hook into React state and lifecycle features from function components.",
            explanation: "e.g., useState, useEffect, useContext."
        },
        {
            question: "What is CSS Grid vs Flexbox?",
            answer: "Flexbox is for 1D layouts (row OR column). Grid is for 2D layouts (rows AND columns).",
            explanation: "Use Flexbox for alignment; Grid for page structure."
        },
        {
            question: "What is the 'this' keyword in JS?",
            answer: "Refers to the object that is executing the current function.",
            explanation: "Its value depends on how the function is called (method, standalone, arrow function)."
        },
        {
            question: "What are Promises?",
            answer: "Objects representing the eventual completion or failure of an asynchronous operation.",
            explanation: "Replaced callback hell with .then() and .catch()."
        },
        {
            question: "What is Async/Await?",
            answer: "Syntactic sugar built on top of Promises.",
            explanation: "Makes asynchronous code look and behave like synchronous code."
        },
        {
            question: "What is Webpack?",
            answer: "A static module bundler for JavaScript applications.",
            explanation: "It takes modules with dependencies and generates static assets."
        },
        {
            question: "What is SSR (Server-Side Rendering)?",
            answer: "Rendering the web page on the server before sending it to the client.",
            explanation: "Improves SEO and initial load performance (e.g., Next.js)."
        },
        {
            question: "What is a Single Page Application (SPA)?",
            answer: "Web app that loads a single HTML page and dynamically updates that page as the user interacts with the app.",
            explanation: "Provides a more fluid user experience like a native app."
        },
        {
            question: "What is Hoisting?",
            answer: "JS mechanism where variables and function declarations are moved to the top of their scope before code execution.",
            explanation: "Allows using functions before they are declared."
        },
        {
            question: "What is Semantic HTML?",
            answer: "Using HTML tags that convey meaning, like <article>, <header>, <footer> instead of <div>.",
            explanation: "Important for accessibility and SEO."
        },
        {
            question: "What is Cross-Origin Resource Sharing (CORS)?",
            answer: "A mechanism that uses HTTP headers to tell browsers to let a web application running at one origin, have permission to access selected resources from a different origin.",
            explanation: "Security feature to prevent malicious scripts."
        },
        {
            question: "What is the key prop in React lists?",
            answer: "A special string attribute you need to include when creating lists of elements.",
            explanation: "Helps React identify which items have changed, added, or removed."
        },
        {
            question: "What is Prop Drilling?",
            answer: "Process of passing data from a parent component down to a deep child through intermediate components.",
            explanation: "Can be avoided with Context API or Redux."
        },
        {
            question: "What is LocalStorage vs SessionStorage?",
            answer: "LocalStorage persists until explicitly deleted. SessionStorage persists only for the session (tab close).",
            explanation: "Both store key-value pairs in the browser."
        },
        {
            question: "What constitutes 'Critical Rendering Path'?",
            answer: "Sequence of steps the browser goes through to convert the HTML, CSS, and JS into pixels on the screen.",
            explanation: "Optimizing this improves paint times."
        },
        {
            question: "What is TypeScript?",
            answer: "A strict syntactical superset of JavaScript that adds optional static typing.",
            explanation: "Helps catch errors at compile time rather than runtime."
        },
        {
            question: "What is Responsive Image technique?",
            answer: "Using 'srcset' and 'sizes' attributes to serve different image resolutions based on device width.",
            explanation: "Improves performance on mobile devices."
        },
        {
            question: "What is the difference between em and rem?",
            answer: "'em' is relative to the font-size of its direct or nearest parent. 'rem' is relative to the root (html) font-size.",
            explanation: "Using rem is generally preferred for consistency."
        },
        {
            question: "What is a Thunk in Redux?",
            answer: "A middleware that allows you to write action creators that return a function instead of an action.",
            explanation: "Used for handling asynchronous logic like API calls."
        },
        {
            question: "What is Memoization?",
            answer: "An optimization technique used primarily to speed up computer programs by storing the results of expensive function calls.",
            explanation: "React.memo and useMemo use this concept."
        },
        {
            question: "What is the Shadow DOM?",
            answer: "A web standard that offers component style and markup encapsulation.",
            explanation: "Used in Web Components so styles don't leak out or in."
        },
        {
            question: "What is Tree Shaking?",
            answer: "A term commonly used in the JavaScript context for dead code elimination.",
            explanation: "Webpack or Rollup removes unused exports to reduce bundle size."
        }
    ],
    "Product Manager": [
        {
            question: "What is a Product Manager?",
            answer: "A Product Manager is responsible for the strategy, roadmap, and feature definition for a product or product line. They bridge the gap between business, technology, and user experience.",
            explanation: "Ideally, they are the CEO of the product."
        },
        {
            question: "How do you prioritize features?",
            answer: "I use frameworks like RICE (Reach, Impact, Confidence, Effort), MoSCoW (Must have, Should have, Could have, Won't have), or the Kano Model to prioritize based on business value and user needs.",
            explanation: "Prioritization is key to delivering value with limited resources."
        },
        {
            question: "What is an MVP?",
            answer: "Minimum Viable Product. It is the version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort.",
            explanation: "It prevents building products that customers do not want."
        },
        {
            question: "How do you define success for a product?",
            answer: "By defining clear Key Performance Indicators (KPIs) such as User Acquisition, Retention Rate, Daily Active Users (DAU), and Net Promoter Score (NPS).",
            explanation: "Metrics should align with overall business goals."
        },
        {
            question: "What is Agile methodology?",
            answer: "An iterative approach to project management and software development that helps teams deliver value to their customers faster and with fewer headaches.",
            explanation: "It focuses on collaboration, customer feedback, and small, rapid releases."
        },
        {
            question: "How do you handle a feature request from a major stakeholder that doesn't fit the roadmap?",
            answer: "I would listen to their need, understand the 'why' behind it, and evaluate it against the current priorities and goals. If it's critical, we trade it off; otherwise, it goes into the backlog.",
            explanation: "Data-driven pushback is often necessary."
        },
        {
            question: "What is User Acceptance Testing (UAT)?",
            answer: "The final phase of the software testing process where actual software users test the software to make sure it can handle required tasks in real-world scenarios.",
            explanation: "It ensures the product is ready for release."
        },
        {
            question: "Difference between a Product Manager and a Project Manager?",
            answer: "Product Managers deal with the 'What' and 'Why' (Strategy, Roadmap). Project Managers deal with the 'How' and 'When' (Execution, Timeline, Resources).",
            explanation: "One is strategic, the other is tactical."
        },
        {
            question: "What are User Stories?",
            answer: "Short, simple descriptions of a feature told from the perspective of the person who desires the new capability, usually a user or customer of the system.",
            explanation: "Format: As a <type of user>, I want <some goal> so that <some reason>."
        },
        {
            question: "What is Churn Rate?",
            answer: "The percentage of service subscribers who discontinue their subscriptions within a given time period.",
            explanation: "Lower churn is critical for SaaS growth."
        },
        {
            question: "How do you conduct market research?",
            answer: "Through surveys, user interviews, competitor analysis, focus groups, and analyzing market trends and reports.",
            explanation: "It validates assumptions before building."
        },
        {
            question: "What is a Roadmap?",
            answer: "A shared source of truth that outlines the vision, direction, priorities, and progress of a product over time.",
            explanation: "It aligns stakeholders and development teams."
        },
        {
            question: "What is A/B Testing?",
            answer: "Comparing two versions of a webpage or app against each other to determine which one performs better.",
            explanation: "Essential for optimizing conversion rates."
        },
        {
            question: "What is CAC (Customer Acquisition Cost)?",
            answer: "The cost associated with convincing a customer to buy a product/service.",
            explanation: "Calculated by dividing all sales and marketing costs by the number of new customers acquired."
        },
        {
            question: "What is LTV (Lifetime Value)?",
            answer: "The total revenue a business can reasonably expect from a single customer account.",
            explanation: "LTV:CAC ratio is a key measure of business health."
        },
        {
            question: "How do you deal with engineering delays?",
            answer: "Communicate early with stakeholders, understand the root cause, cut scope if necessary to meet deadlines, or adjust the timeline.",
            explanation: "Transparency is key."
        },
        {
            question: "What is Product-Market Fit?",
            answer: "Being in a good market with a product that can satisfy that market.",
            explanation: "Signified by organic growth and high retention."
        },
        {
            question: "What tools do you use for Product Management?",
            answer: "Jira/Linear for tracking, Figma for design, Notion/Confluence for documentation, Mixpanel/Amplitude for analytics.",
            explanation: "Tools facilitate collaboration and tracking."
        },
        {
            question: "How do you measure retention?",
            answer: "By tracking the percentage of users who return to the app after their first visit over specific time periods (Day 1, Day 7, Day 30).",
            explanation: "Cohort analysis is often used."
        },
        {
            question: "What is a Wireframe vs Mockup vs Prototype?",
            answer: "Wireframe = Skeleton/Structure. Mockup = Visual Design/Colors. Prototype = Interactive/Clickable.",
            explanation: "Fidelity increases at each step."
        },
        {
            question: "What is a Sprint?",
            answer: "A set period of time during which specific work has to be completed and made ready for review (usually 2 weeks in Scrum).",
            explanation: "Allows for iterative development."
        },
        {
            question: "What is Technical Debt?",
            answer: "The implied cost of additional rework caused by choosing an easy (limited) solution now instead of using a better approach that would take longer.",
            explanation: "It must be paid down eventually or development slows."
        },
        {
            question: "How do you handle conflict in a team?",
            answer: "Listen to all sides, focus on data and the user problem, and facilitate a compromise or make a decided call if necessary.",
            explanation: "Psychological safety is important."
        },
        {
            question: "What is NPS?",
            answer: "Net Promoter Score. A metric used to gauge customer loyalty by asking 'How likely is it that you would recommend our product to a friend?'.",
            explanation: "Range -100 to 100."
        },
        {
            question: "What is the specific role of a Product Owner in Scrum?",
            answer: "To maximize the value of the product resulting from work of the Development Team. Manages the Product Backlog.",
            explanation: "Often synonymous with PM in smaller orgs, but distinct in Scrum."
        },
        {
            question: "What is a 'North Star Metric'?",
            answer: "The single metric that best captures the core value your product delivers to its customers.",
            explanation: "e.g., Spotify = Time spent listening."
        },
        {
            question: "What is Discovery vs Delivery?",
            answer: "Discovery is figuring out what to build (User Research). Delivery is building it (Engineering).",
            explanation: "Continuous discovery is best practice."
        },
        {
            question: "How do you monetize a product?",
            answer: "Freemium, Subscription (SaaS), Ads, Transaction fees, Licensing.",
            explanation: "Depends on user base and value proposition."
        },
        {
            question: "What is Design Thinking?",
            answer: "A non-linear, iterative process that teams use to understand users, challenge assumptions, redefine problems and create innovative solutions to prototype and test.",
            explanation: "Empathize, Define, Ideate, Prototype, Test."
        },
        {
            question: "What is a Pain Point?",
            answer: "A specific problem that prospective customers of your business are experiencing.",
            explanation: "Products solve pain points."
        }
    ]
};
