import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Grid3x3, X } from 'lucide-react';

const SurveyChoiceModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleTakeSurvey = () => {
        localStorage.removeItem('skipSurvey');
        localStorage.removeItem('formData');
        localStorage.removeItem('completedCourses');
        localStorage.removeItem('enrolledCourses');
        navigate('/survey');
        onClose();
    };

    const handleSkipSurvey = () => {
        localStorage.setItem('skipSurvey', 'true');
        localStorage.removeItem('formData');
        localStorage.removeItem('completedCourses');
        localStorage.removeItem('enrolledCourses');
        navigate('/results', { state: { skipSurvey: true } });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="card"
                        style={{
                            maxWidth: '600px',
                            width: '100%',
                            padding: '40px',
                            position: 'relative'
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: 'pointer',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ fontSize: '2rem', marginBottom: '16px', textAlign: 'center' }}>
                            How would you like to start?
                        </h2>
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>
                            Choose your preferred path to discover your career journey
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Option 1: Take Survey */}
                            <motion.button
                                onClick={handleTakeSurvey}
                                className="card"
                                style={{
                                    padding: '24px',
                                    border: '2px solid transparent',
                                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{
                                        background: 'var(--gradient-main)',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Sparkles size={24} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                            Take Survey & Get Personalized Recommendations
                                            <span style={{
                                                background: 'rgba(16, 185, 129, 0.2)',
                                                color: '#10b981',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}>
                                                RECOMMENDED
                                            </span>
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '12px' }}>
                                            Answer a few questions about your interests, work style, and goals to receive AI-powered career recommendations tailored just for you.
                                        </p>
                                        <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '20px', margin: 0 }}>
                                            <li>Personalized career matches based on your profile</li>
                                            <li>Customized learning paths</li>
                                            <li>Takes only 3-5 minutes</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.button>

                            {/* Option 2: Skip Survey */}
                            <motion.button
                                onClick={handleSkipSurvey}
                                className="card"
                                style={{
                                    padding: '24px',
                                    border: '2px solid transparent',
                                    background: 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--border-light)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Grid3x3 size={24} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'white' }}>
                                            Skip Survey & Explore All Career Paths
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '12px' }}>
                                            Browse all available career domains and choose the one that interests you most.
                                        </p>
                                        <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '20px', margin: 0 }}>
                                            <li>View all 9 career domains</li>
                                            <li>Choose any path that interests you</li>
                                            <li>Start learning immediately</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SurveyChoiceModal;
