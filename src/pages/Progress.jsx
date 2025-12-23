import React, { useState, useEffect } from 'react';
import { courses } from '../data/courses';
import { motion } from 'framer-motion';

const Progress = () => {
    const [stats, setStats] = useState({
        completionRate: 0,
        enrolledCount: 0,
        completedCount: 0,
        hoursLearning: 0
    });

    useEffect(() => {
        // Flatten all courses to get a master list
        const allCourses = [];
        Object.values(courses).forEach(domain => {
            if (domain.beginner) allCourses.push(...domain.beginner);
            if (domain.intermediate) allCourses.push(...domain.intermediate);
            if (domain.advanced) allCourses.push(...domain.advanced);
        });

        // Deduplicate courses based on title (handling the default fallback structure if needed)
        // Actually, let's just use the selected domain's courses if possible, 
        // BUT the Dashboard completion logic seemed to use ALL courses from the selected domain.
        // However, the dashboard logic flatly used 'Data Scientist' or 'default'. 
        // To be consistent with Dashboard's global progress bar, we should probably stick to 
        const savedCompleted = localStorage.getItem('completedCourses');
        const completedSet = savedCompleted ? new Set(JSON.parse(savedCompleted)) : new Set();

        const savedEnrolled = localStorage.getItem('enrolledCourses');
        const enrolledSet = savedEnrolled ? new Set(JSON.parse(savedEnrolled)) : new Set();

        // 1. Calculate Global Stats
        let totalHours = 0;
        const allCoursesMap = {};

        // Helper to parse duration
        const parseDuration = (str) => parseInt(str.replace(/\D/g, ''), 10) || 0;

        // Iterate all courses to build map and calculate potential total hours for enrolled items
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

        // 2. Calculate Domain-Specific Stats
        const stats = Object.keys(courses).map(domainName => {
            if (domainName === 'default') return null; // Skip default/fallback bucket if preferred, or keep it.

            const domainData = courses[domainName];
            const domainCourseList = [
                ...domainData.beginner,
                ...domainData.intermediate,
                ...domainData.advanced
            ];

            const totalCourses = domainCourseList.length;
            const completedInDomain = domainCourseList.filter(c => completedSet.has(c.title)).length;
            const progress = totalCourses > 0 ? Math.round((completedInDomain / totalCourses) * 100) : 0;

            return {
                name: domainName,
                progress,
                total: totalCourses,
                completed: completedInDomain
            };
        }).filter(Boolean); // Remove nulls

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
            <div style={{ marginBottom: '40px' }}>
                <motion.h1
                    style={{ fontSize: '2.5rem' }}
                    variants={itemVariants}
                >
                    Your Progress
                </motion.h1>
                <motion.p
                    style={{ color: 'var(--text-muted)' }}
                    variants={itemVariants}
                >
                    Track your journey towards your dream career.
                </motion.p>
            </div>

            <motion.div variants={itemVariants} style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Domain Mastery</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {domainStats.map((stat) => (
                        <motion.div
                            key={stat.name}
                            className="card"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{stat.name}</h3>
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{stat.progress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                                <motion.div
                                    style={{ width: `${stat.progress}%`, height: '100%', background: 'var(--gradient-main)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                                {stat.completed} / {stat.total} Courses
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Global Stats</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <motion.div
                    className="card"
                    style={{ textAlign: 'center', padding: '32px' }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>{globalStats.enrolledCount}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Total Enrolled</p>
                </motion.div>
                <motion.div
                    className="card"
                    style={{ textAlign: 'center', padding: '32px' }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>{globalStats.completedCount}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Total Completed</p>
                </motion.div>
                <motion.div
                    className="card"
                    style={{ textAlign: 'center', padding: '32px' }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>{globalStats.hoursLearning}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Hours Learning</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Progress;
