import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import { getCareerRecommendations } from '../services/ai';
import { getAllDomains } from '../data/courses';
import ResumeUpload from '../components/common/ResumeUpload';
import SkillsGapAnalysis from '../components/common/SkillsGapAnalysis';
import './Results.css';

const Results = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [domains, setDomains] = useState([]);
    const [isSkipSurvey, setIsSkipSurvey] = useState(false);
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeData');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const skipSurvey = state?.skipSurvey || localStorage.getItem('skipSurvey') === 'true';

            if (skipSurvey) {
                setIsSkipSurvey(true);
                const allDomains = getAllDomains();
                const domainsData = allDomains.map(career => ({ career, prob: 1 }));
                setDomains(domainsData);
                localStorage.setItem('suggestedDomains', JSON.stringify(domainsData));

                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('openChatbotWithWelcome', {
                        detail: {
                            careers: allDomains,
                            fromSurvey: false
                        }
                    }));
                }, 1500);

                setLoading(false);
            } else if (state?.formData) {
                try {
                    const preds = await getCareerRecommendations(state.formData);
                    if (!cancelled) {
                        const arr = preds.map(p => (typeof p === 'string' ? { career: p, prob: 1 } : p));
                        setDomains(arr);
                        localStorage.setItem('suggestedDomains', JSON.stringify(arr));

                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('openChatbotWithWelcome', {
                                detail: {
                                    careers: arr.map(d => d.career),
                                    fromSurvey: true
                                }
                            }));
                        }, 1500);
                    }
                } catch (err) {
                    console.error('Error fetching recommendations', err);
                    if (!cancelled) {
                        const fallbacks = [{ career: 'Data Scientist', prob: 1 }, { career: 'Backend Developer', prob: 1 }, { career: 'UI/UX Designer', prob: 1 }];
                        setDomains(fallbacks);
                        localStorage.setItem('suggestedDomains', JSON.stringify(fallbacks));
                    }
                } finally {
                    if (!cancelled) setLoading(false);
                }
            } else {
                // No survey taken and no form data — show all domains (same as skip survey)
                setIsSkipSurvey(true);
                const allDomains = getAllDomains();
                const domainsData = allDomains.map(career => ({ career, prob: 1 }));
                setDomains(domainsData);
                localStorage.setItem('suggestedDomains', JSON.stringify(domainsData));
                setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [state]);

    const handleDomainSelect = (domain) => {
        navigate('/dashboard', { state: { selectedDomain: domain } });
    };

    if (loading) {
        return (
            <div className="container results-loading">
                <div className="results-loading-icon">
                    <Loader size={48} className="loader-spin" color="var(--primary)" />
                </div>
                <h2>Analyzing your profile...</h2>
                <p>Matching your skills with 50+ career paths</p>
            </div>
        );
    }

    return (
        <div className="container results-container">
            <div className="results-header">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {isSkipSurvey ? 'Explore All Career Paths' : 'Your Perfect Career Matches'}
                </motion.h1>
                <motion.p
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {isSkipSurvey
                        ? 'Browse through all available career domains and choose the path that excites you the most.'
                        : 'Based on your skills, interests, and personality, these are your top domains.'}
                </motion.p>
            </div>

            <motion.div
                className="results-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.15 }}
            >
                {domains.map((d, index) => (
                    <motion.div
                        key={d.career}
                        className={`card career-card ${index === 0 && !isSkipSurvey ? 'best-match' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="career-card-accent" />

                        <h3>{d.career}</h3>
                        <p className="career-card-desc">
                            {d.career === 'UI/UX Designer' ? 'Design intuitive interfaces and craft seamless user experiences.' :
                                d.career === 'Data Scientist' ? 'Analyze complex data sets to solve business problems using ML.' :
                                    d.career === 'Backend Developer' ? 'Build robust server-side applications and scalable APIs.' :
                                        'A great career path matching your logical and analytical skills.'}
                        </p>

                        <div className="career-card-footer">
                            <motion.button
                                className="btn-primary"
                                onClick={() => handleDomainSelect(d.career)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start Learning Path
                            </motion.button>
                            {!isSkipSurvey && <span className="career-card-match">{Math.round((d.prob || 1) * 100)}% match</span>}
                        </div>

                        {index === 0 && !isSkipSurvey && (
                            <div className="best-match-badge">
                                <CheckCircle size={12} /> BEST MATCH
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Resume Upload Section */}
            <div className="results-resume-section">
                <ResumeUpload onResumeAnalyzed={(data) => setResumeData(data)} />
            </div>

            {/* Skills Gap Analysis for each career */}
            {resumeData && domains.length > 0 && (
                <div className="results-resume-section">
                    {domains.map((d, index) => (
                        <SkillsGapAnalysis
                            key={d.career}
                            resumeData={resumeData}
                            career={d.career}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Results;
