import React from 'react';

const Progress = () => {
    return (
        <div className="container">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Your Progress</h1>
                <p style={{ color: 'var(--text-muted)' }}>Track your journey towards your dream career.</p>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span>Domain Readiness</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>35%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '35%', height: '100%', background: 'var(--gradient-main)' }}></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>2</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Courses Enrolled</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>0</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Courses Completed</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>12</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Hours Learning</p>
                </div>
            </div>
        </div>
    );
};

export default Progress;
