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
        localStorage.removeItem('resumeData');
        navigate('/survey');
        onClose();
    };

    const handleSkipSurvey = () => {
        localStorage.setItem('skipSurvey', 'true');
        localStorage.removeItem('formData');
        localStorage.removeItem('completedCourses');
        localStorage.removeItem('enrolledCourses');
        localStorage.removeItem('resumeData');
        navigate('/results', { state: { skipSurvey: true } });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content"
                        style={{ maxWidth: '600px', padding: 'var(--space-10)' }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>

                        <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)', textAlign: 'center', fontWeight: 700 }}>
                            How would you like to start?
                        </h2>
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                            Choose your preferred path to discover your career journey
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {/* Option 1: Take Survey */}
                            <motion.button
                                onClick={handleTakeSurvey}
                                className="card"
                                style={{
                                    padding: 'var(--space-6)',
                                    border: '2px solid transparent',
                                    background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.08), rgba(19, 136, 8, 0.08))',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                                    <div style={{
                                        background: 'var(--gradient-main)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: 'var(--space-3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Sparkles size={24} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'white', flexWrap: 'wrap' }}>
                                            Take Survey & Get Personalized Recommendations
                                            <span className="badge badge-success">RECOMMENDED</span>
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                                            Answer a few questions about your interests, work style, and goals to receive AI-powered career recommendations tailored just for you.
                                        </p>
                                        <ul style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', paddingLeft: '20px', margin: 0 }}>
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
                                    padding: 'var(--space-6)',
                                    border: '2px solid transparent',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--border-light)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: 'var(--space-3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Grid3x3 size={24} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)', color: 'white' }}>
                                            Skip Survey & Explore All Career Paths
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                                            Browse all available career domains and choose the one that interests you most.
                                        </p>
                                        <ul style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', paddingLeft: '20px', margin: 0 }}>
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
