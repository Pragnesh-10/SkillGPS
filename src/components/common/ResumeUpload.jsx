import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { parseResume } from '../../utils/resumeParser';

const ResumeUpload = ({ onResumeAnalyzed }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [countdown, setCountdown] = useState(10);
    const deleteTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        setFileName(file.name);
        setIsAnalyzing(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            setResumeText(text);

            // Parse the resume
            setTimeout(() => {
                const parsed = parseResume(text);
                setParsedData(parsed);
                setIsAnalyzing(false);

                // Callback to parent
                if (onResumeAnalyzed) {
                    onResumeAnalyzed(parsed);
                }

                // Store in localStorage
                localStorage.setItem('resumeData', JSON.stringify(parsed));

                // Reset countdown to 30 seconds
                setCountdown(30);
            }, 800);
        };

        reader.readAsText(file);
    };

    const handleClear = () => {
        // Clear timers
        if (deleteTimerRef.current) {
            clearTimeout(deleteTimerRef.current);
            deleteTimerRef.current = null;
        }
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }

        setResumeText('');
        setFileName('');
        setParsedData(null);
        setCountdown(10);
        localStorage.removeItem('resumeData');
        if (onResumeAnalyzed) {
            onResumeAnalyzed(null);
        }
    };

    // Check localStorage on mount and periodically to sync state
    useEffect(() => {
        const checkLocalStorage = () => {
            const savedResumeData = localStorage.getItem('resumeData');
            // If localStorage is empty but component has data, clear it
            if (!savedResumeData && parsedData) {
                setResumeText('');
                setFileName('');
                setParsedData(null);
                setCountdown(10);
                if (onResumeAnalyzed) {
                    onResumeAnalyzed(null);
                }
            }
        };

        // Check on mount
        checkLocalStorage();

        // Check periodically (every 2 seconds) to catch auto-delete
        const interval = setInterval(checkLocalStorage, 2000);

        return () => clearInterval(interval);
    }, [parsedData, onResumeAnalyzed]);

    // Auto-delete timer - delete resume data after 10 seconds
    useEffect(() => {
        if (parsedData) {
            // Clear any existing timers
            if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

            // Set countdown interval (updates every second)
            countdownTimerRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownTimerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Set delete timer (deletes after 10 seconds)
            deleteTimerRef.current = setTimeout(() => {
                // Only remove from localStorage, keep UI state for skills analysis
                localStorage.removeItem('resumeData');
                setCountdown(10);
            }, 10000); // 10 seconds

            // Cleanup on unmount
            return () => {
                if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
            };
        }
    }, [parsedData]);

    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
                Upload Your Resume
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Upload your resume to see how your skills match these career paths
            </p>

            {!parsedData ? (
                <motion.div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="card"
                    style={{
                        padding: '40px',
                        textAlign: 'center',
                        border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--border)',
                        background: isDragging ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    whileHover={{ scale: 1.01 }}
                >
                    <Upload size={48} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />

                    {isAnalyzing ? (
                        <div>
                            <div className="loader" style={{ margin: '0 auto 16px' }}>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .loader { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }`}</style>
                            </div>
                            <p>Analyzing {fileName}...</p>
                        </div>
                    ) : (
                        <>
                            <h3 style={{ marginBottom: '8px' }}>
                                Drop your resume here or click to browse
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                Supports .txt files
                            </p>
                            <input
                                type="file"
                                accept=".txt"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                id="resume-upload"
                            />
                            <label htmlFor="resume-upload">
                                <motion.button
                                    className="btn-primary"
                                    onClick={() => document.getElementById('resume-upload').click()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Choose File
                                </motion.button>
                            </label>
                        </>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                    style={{ padding: '24px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FileText size={24} color="var(--primary)" />
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{fileName}</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {parsedData.skillCount} skills identified
                                </p>
                            </div>
                        </div>
                        <motion.button
                            onClick={handleClear}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                padding: '8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X size={18} />
                        </motion.button>
                    </div>

                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <CheckCircle size={20} color="#10b981" />
                        <span style={{ color: '#10b981', fontWeight: '500' }}>
                            Resume analyzed successfully! See your skills match below.
                        </span>
                    </div>

                    {/* Show top skills found */}
                    <div style={{ marginTop: '20px' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-muted)' }}>
                            Top Skills Found:
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {parsedData.skills.slice(0, 15).map((skill, index) => (
                                <span
                                    key={index}
                                    style={{
                                        background: 'rgba(139, 92, 246, 0.2)',
                                        color: 'var(--primary)',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        fontSize: '0.85rem',
                                        border: '1px solid rgba(139, 92, 246, 0.3)'
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ResumeUpload;
