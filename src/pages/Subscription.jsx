import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanCard = ({ title, price, features, isPremium, onSelect }) => (
    <div className="card" style={{
        flex: 1,
        border: isPremium ? '2px solid var(--primary)' : '1px solid var(--border-light)',
        transform: isPremium ? 'scale(1.05)' : 'scale(1)',
        position: 'relative'
    }}>
        {isPremium && (
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--gradient-main)', padding: '4px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                RECOMMENDED
            </div>
        )}

        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: isPremium ? 'var(--primary)' : 'var(--text-main)' }}>{title}</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px' }}>
            {price} <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span>
        </div>

        <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
            {features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                    <div style={{ background: isPremium ? 'var(--primary-glow)' : 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '4px', display: 'flex' }}>
                        <Check size={14} color={isPremium ? 'var(--primary)' : 'var(--text-muted)'} />
                    </div>
                    <span style={{ color: feat.enabled ? 'var(--text-main)' : 'var(--text-muted)', opacity: feat.enabled ? 1 : 0.5 }}>
                        {feat.text}
                    </span>
                </li>
            ))}
        </ul>

        <button
            onClick={onSelect}
            className={isPremium ? 'btn-primary' : ''}
            style={{
                width: '100%',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                background: isPremium ? 'var(--gradient-main)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
            }}
        >
            {isPremium ? 'Get Premium' : 'Continue Free'}
        </button>
    </div>
);

const Subscription = () => {
    const navigate = useNavigate();

    const handleSubscribe = () => {
        localStorage.setItem('isPremium', 'true');
        alert('Welcome to Premium! You can now talk to experts.');
        navigate('/experts');
    };

    return (
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
            <div style={{ marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Invest in your Future</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Unlock the full potential of your career with personalized guidance.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', textAlign: 'left' }}>
                    <PlanCard
                        title="Free"
                        price="$0"
                        features={[
                            { text: 'Career Survey & Analysis', enabled: true },
                            { text: 'Basic Course Recommendations', enabled: true },
                            { text: 'Limited Expert Profiles', enabled: true },
                            { text: '1:1 Expert Sessions', enabled: false },
                            { text: 'Mock Interviews', enabled: false },
                        ]}
                        onSelect={() => navigate('/dashboard')}
                    />

                    <PlanCard
                        title="Premium"
                        price="$19"
                        isPremium={true}
                        features={[
                            { text: 'Career Survey & Analysis', enabled: true },
                            { text: 'Complete Learning Paths', enabled: true },
                            { text: 'Unlimited Expert Access', enabled: true },
                            { text: '1:1 Expert Sessions (2/mo)', enabled: true },
                            { text: 'Mock Interviews', enabled: true },
                        ]}
                        onSelect={handleSubscribe}
                    />
                </div>
            </div>
        </div>
    );
};

export default Subscription;
