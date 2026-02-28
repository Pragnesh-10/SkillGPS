import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Subscription.css';

const PlanCard = ({ title, price, features, isPremium, onSelect }) => (
    <div className={`card plan-card ${isPremium ? 'premium' : ''}`}>
        {isPremium && (
            <div className="plan-recommended">RECOMMENDED</div>
        )}

        <h3 className={`plan-title ${isPremium ? 'premium' : ''}`}>{title}</h3>
        <div className="plan-price">
            {price} <span className="plan-price-period">/mo</span>
        </div>

        <ul className="plan-features">
            {features.map((feat, i) => (
                <li key={i} className="plan-feature">
                    <div className={`plan-feature-icon ${feat.enabled ? (isPremium ? 'active' : 'inactive') : 'inactive'}`}>
                        <Check size={14} color={feat.enabled ? (isPremium ? 'var(--primary)' : 'var(--text-muted)') : 'var(--text-muted)'} />
                    </div>
                    <span className={`plan-feature-text ${!feat.enabled ? 'disabled' : ''}`}>
                        {feat.text}
                    </span>
                </li>
            ))}
        </ul>

        <button
            onClick={onSelect}
            className={`plan-btn ${isPremium ? 'primary' : 'secondary'}`}
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
        <div className="container subscription-container">
            <Helmet>
                <title>Premium Career Mentorship | SkillGPS</title>
                <meta name="description" content="Unlock your full career potential with SkillGPS Premium. Get personalized learning paths, unlimited expert access, mock interviews, and 1:1 mentorship sessions." />
                <link rel="canonical" href="https://skillgps.vercel.app/subscription" />
            </Helmet>

            <div className="subscription-header">
                    <h1>Premium Career Mentorship with SkillGPS</h1>
                <p>Unlock the full potential of your career with personalized guidance.</p>
            </div>

            <div className="plans-row">
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
    );
};

export default Subscription;
