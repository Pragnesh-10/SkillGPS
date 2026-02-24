import React, { useState, useEffect } from 'react';
import { courses } from '../data/courses';
import { motion } from 'framer-motion';
import './Progress.css';

const Progress = () => {
    const [globalStats, setGlobalStats] = useState({
        enrolledCount: 0,
        completedCount: 0,
        hoursLearning: 0
    });
    const [domainStats, setDomainStats] = useState([]);

    useEffect(() => {
        const allCourses = [];
        Object.values(courses).forEach(domain => {
            if (domain.beginner) allCourses.push(...domain.beginner);
            if (domain.intermediate) allCourses.push(...domain.intermediate);
            if (domain.advanced) allCourses.push(...domain.advanced);
        });

        const savedCompleted = localStorage.getItem('completedCourses');
        const completedSet = savedCompleted ? new Set(JSON.parse(savedCompleted)) : new Set();

        const savedEnrolled = localStorage.getItem('enrolledCourses');
        const enrolledSet = savedEnrolled ? new Set(JSON.parse(savedEnrolled)) : new Set();

        let totalHours = 0;
        const allCoursesMap = {};

        const parseDuration = (str) => parseInt(str.replace(/\D/g, ''), 10) || 0;

        Object.values(courses).forEach(domain => {
            [...domain.beginner, ...domain.intermediate, ...domain.advanced].forEach(c => {
                allCoursesMap[c.title] = c;
            });
        });

        enrolledSet.forEach(title => {
            const course = allCoursesMap[title];
            if (course && course.duration) {
                totalHours += parseDuration(course.duration);
            }
        });

        setGlobalStats({
            enrolledCount: enrolledSet.size,
            completedCount: completedSet.size,
            hoursLearning: totalHours
        });

        const stats = Object.keys(courses).map(domainName => {
            if (domainName === 'default') return null;

            const domainData = courses[domainName];
            const domainCourseList = [
                ...domainData.beginner,
                ...domainData.intermediate,
                ...domainData.advanced
            ];

            const totalCourses = domainCourseList.length;
            const completedInDomain = domainCourseList.filter(c => completedSet.has(c.title)).length;
            const progress = totalCourses > 0 ? Math.min(Math.round((completedInDomain / totalCourses) * 100), 100) : 0;

            return {
                name: domainName,
                progress,
                total: totalCourses,
                completed: completedInDomain
            };
        }).filter(Boolean);

        setDomainStats(stats);

    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="page-header">
                <motion.h1 variants={itemVariants}>
                    Your Progress
                </motion.h1>
                <motion.p variants={itemVariants}>
                    Track your journey towards your dream career.
                </motion.p>
            </div>

            <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-10)' }}>
                <h2 className="progress-section-title">Domain Mastery</h2>
                <div className="domain-mastery-grid">
                    {domainStats.map((stat) => (
                        <motion.div
                            key={stat.name}
                            className="card domain-card"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="domain-card-header">
                                <h3>{stat.name}</h3>
                                <span className="domain-card-percent">{stat.progress}%</span>
                            </div>
                            <div className="domain-card-progress">
                                <div className="progress-track">
                                    <motion.div
                                        className="progress-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.progress}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                            <p className="domain-card-count">
                                {stat.completed} / {stat.total} Courses
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <h2 className="progress-section-title">Global Stats</h2>
            <div className="global-stats-grid">
                <motion.div
                    className="stat-card"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <div className="stat-value gradient-text">{globalStats.enrolledCount}</div>
                    <p className="stat-label">Total Enrolled</p>
                </motion.div>
                <motion.div
                    className="stat-card"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <div className="stat-value gradient-text">{globalStats.completedCount}</div>
                    <p className="stat-label">Total Completed</p>
                </motion.div>
                <motion.div
                    className="stat-card"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <div className="stat-value gradient-text">{globalStats.hoursLearning}</div>
                    <p className="stat-label">Hours Learning</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Progress;
