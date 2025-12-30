import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import { getCareerRecommendations } from '../services/ai';
import ResumeUpload from '../components/common/ResumeUpload';
import SkillsGapAnalysis from '../components/common/SkillsGapAnalysis';

const Results = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [domains, setDomains] = useState([]);
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeData');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (state?.formData) {
                try {
                    const preds = await getCareerRecommendations(state.formData);
                    if (!cancelled) {
                        // normalize to array of {career, prob}
                        // normalize to array of {career, prob}
                        const arr = preds.map(p => (typeof p === 'string' ? { career: p, prob: 1 } : p));
                        setDomains(arr);
                        localStorage.setItem('suggestedDomains', JSON.stringify(arr));

                        // Trigger chatbot to open after results are shown
                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('openChatbotWithWelcome', {
                                detail: {
                                    careers: arr.map(d => d.career),
                                    fromSurvey: true
                                }
                            }));
                        }, 1500); // Wait 1.5s so user can see the results first
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
                // Fallback for direct access without data
                const fallbacks = [{ career: 'Data Scientist', prob: 1 }, { career: 'Backend Developer', prob: 1 }, { career: 'UI/UX Designer', prob: 1 }];
                setDomains(fallbacks);
                localStorage.setItem('suggestedDomains', JSON.stringify(fallbacks));
                setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [state]);

    const handleDomainSelect = (domain) => {
        // Navigate to Dashboard with selected domain
        // passing it in state or context (mocking persistent state)
        navigate('/dashboard', { state: { selectedDomain: domain } });
    };

    if (loading) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ marginBottom: '24px' }}>
                    <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .loader { animation: spin 1s linear infinite; }
          `}</style>
                    <Loader size={48} className="loader" color="var(--primary)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Analyzing your profile...</h2>
                <p style={{ color: 'var(--text-muted)' }}>Matching your skills with 50+ career paths</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <motion.h1
                    style={{ fontSize: '2.5rem', marginBottom: '16px' }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Your Perfect Career Matches
                </motion.h1>
                <motion.p
                    style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Based on your skills, interests, and personality, these are your top domains.
                </motion.p>
            </div>

            <motion.div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.15 }}
            >
                {domains.map((d, index) => (
                    <motion.div
                        key={d.career}
                        className="card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                        transition={{ duration: 0.4 }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: index === 0 ? 'var(--gradient-main)' : 'var(--border-light)'
                        }}></div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', marginTop: '12px' }}>{d.career}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '8px', flex: 1 }}>
                            {d.career === 'UI/UX Designer' ? 'Design intuitive interfaces and craft seamless user experiences.' :
                                d.career === 'Data Scientist' ? 'Analyze complex data sets to solve business problems using ML.' :
                                    d.career === 'Backend Developer' ? 'Build robust server-side applications and scalable APIs.' :
                                        'A great career path matching your logical and analytical skills.'}
                        </p>

                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <motion.button
                                className="btn-primary"
                                style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}
                                onClick={() => handleDomainSelect(d.career)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start Learning Path
                            </motion.button>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{Math.round((d.prob || 1) * 100)}% match</div>
                        </div>

                        {index === 0 && (
                            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle size={12} /> BEST MATCH
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Resume Upload Section */}
            <ResumeUpload onResumeAnalyzed={(data) => setResumeData(data)} />

            {/* Skills Gap Analysis for each career */}
            {resumeData && domains.length > 0 && (
                <div style={{ marginTop: '40px' }}>
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
