import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Star } from 'lucide-react';

const experts = [
    { id: 1, name: 'Sarah Chen', role: 'Staff Data Scientist', company: 'Google', exp: '8 years', domain: 'Data Scientist' },
    { id: 2, name: 'David Miller', role: 'Senior Backend Eng', company: 'Netflix', exp: '10 years', domain: 'Backend Developer' },
    { id: 3, name: 'Emily Zhang', role: 'Product Lead', company: 'Airbnb', exp: '7 years', domain: 'Product Manager' },
    { id: 4, name: 'Michael Brown', role: 'Principle Engineer', company: 'Amazon', exp: '12 years', domain: 'Cloud Engineer' },
];

const Experts = () => {
    const navigate = useNavigate();
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const premiumStatus = localStorage.getItem('isPremium') === 'true';
        setIsPremium(premiumStatus);
    }, []);

    const handleConnect = (expertName) => {
        if (!isPremium) {
            // Trigger Paywall / Navigate to Subscription
            navigate('/subscription');
        } else {
            alert(`Request sent to ${expertName}! They will contact you shortly.`);
        }
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Talk to Industry Experts</h1>
                <p style={{ color: 'var(--text-muted)' }}>Get 1:1 guidance, mock interviews, and resume reviews.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {experts.map(expert => (
                    <div key={expert.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                                {expert.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{expert.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{expert.role} at {expert.company}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                            <span>Exp: {expert.exp}</span>
                            <span>•</span>
                            <span>{expert.domain}</span>
                        </div>

                        <button
                            className={isPremium ? 'btn-primary' : ''}
                            style={{
                                marginTop: 'auto',
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                border: isPremium ? 'none' : '1px solid var(--border-light)',
                                background: isPremium ? 'var(--gradient-main)' : 'transparent',
                                color: isPremium ? 'white' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => handleConnect(expert.name)}
                        >
                            {isPremium ? 'Connect Now' : (
                                <>
                                    Connect <Lock size={16} />
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experts;
