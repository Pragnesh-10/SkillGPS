import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { courses } from '../data/courses';
import { PlayCircle, Clock, Star, CheckCircle, Circle } from 'lucide-react';

const CourseCard = ({ course, isCompleted, onToggle }) => (
    <div className="card" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: isCompleted ? '1px solid var(--accent)' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{course.title}</h4>
            <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                {course.platform}
            </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {course.duration}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} color="#fbbf24" fill="#fbbf24" /> {course.rating}</span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Outcome: {course.outcome}</p>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.9rem', flex: 1 }}
                onClick={() => window.open(course.link, '_blank')}
            >
                Start Course
            </button>
            <button
                className="btn-secondary"
                style={{
                    padding: '8px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                    color: isCompleted ? '#22c55e' : 'inherit',
                    border: isCompleted ? '1px solid #22c55e' : '1px solid transparent'
                }}
                onClick={onToggle}
                title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
            >
                {isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
            </button>
        </div>
    </div>
);

const Section = ({ title, items, completedSet, onToggle }) => (
    <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', borderLeft: '4px solid var(--primary)', paddingLeft: '12px' }}>{title}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {items.map((item, idx) => (
                <CourseCard
                    key={idx}
                    course={item}
                    isCompleted={completedSet.has(item.title)}
                    onToggle={() => onToggle(item.title)}
                />
            ))}
        </div>
    </div>
);

const Dashboard = () => {
    const location = useLocation();
    const selectedDomain = location.state?.selectedDomain || 'Data Scientist'; // Fallback

    const domainCourses = courses[selectedDomain] || courses['default'];

    // Flatten all courses into a single list for easy counting
    const allCourses = [
        ...domainCourses.beginner,
        ...domainCourses.intermediate,
        ...domainCourses.advanced
    ];

    // State for completed courses
    const [completedCourses, setCompletedCourses] = useState(() => {
        const saved = localStorage.getItem('completedCourses');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    useEffect(() => {
        localStorage.setItem('completedCourses', JSON.stringify([...completedCourses]));
    }, [completedCourses]);

    const toggleCourse = (title) => {
        setCompletedCourses(prev => {
            const next = new Set(prev);
            if (next.has(title)) {
                next.delete(title);
            } else {
                next.add(title);
            }
            return next;
        });
    };

    const progress = Math.round((completedCourses.size / allCourses.length) * 100) || 0;

    return (
        <div className="container">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Your Learning Path: <span className="gradient-text">{selectedDomain}</span></h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Curated courses to take you from Beginner to Expert.</p>

                {/* Progress Bar */}
                <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginTop: '10px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                </div>
                <p style={{ textAlign: 'right', fontSize: '0.9rem', marginTop: '5px', color: 'var(--text-muted)' }}>{progress}% Complete</p>
            </div>

            <Section title="Beginner" items={domainCourses.beginner} completedSet={completedCourses} onToggle={toggleCourse} />
            <Section title="Intermediate" items={domainCourses.intermediate} completedSet={completedCourses} onToggle={toggleCourse} />
            <Section title="Advanced" items={domainCourses.advanced} completedSet={completedCourses} onToggle={toggleCourse} />
        </div>
    );
};

export default Dashboard;
