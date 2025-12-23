import React from 'react';
import StepWrapper from './StepWrapper';

const InterestCard = ({ label, value, onChange }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: '12px'
        }}>
            <span style={{ color: 'var(--text-main)', flex: 1 }}>{label}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => onChange(true)}
                    style={{
                        padding: '6px 16px',
                        borderRadius: '12px',
                        background: value === true ? 'var(--primary-glow)' : 'transparent',
                        border: value === true ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                        color: value === true ? 'var(--primary)' : 'var(--text-muted)',
                        fontSize: '0.85rem'
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => onChange(false)}
                    style={{
                        padding: '6px 16px',
                        borderRadius: '12px',
                        background: value === false ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: value === false ? '1px solid white' : '1px solid var(--border-light)',
                        color: value === false ? 'white' : 'var(--text-muted)',
                        fontSize: '0.85rem'
                    }}
                >
                    No
                </button>
            </div>
        </div>
    );
};

const InterestStep = ({ data, updateData, onNext, onBack }) => {
    const interests = [
        { key: 'numbers', label: 'Do you like numbers and patterns?' },
        { key: 'building', label: 'Do you like building things from scratch?' },
        { key: 'design', label: 'Do you like design and visuals?' },
        { key: 'explaining', label: 'Do you like explaining concepts to others?' },
        { key: 'logic', label: 'Do you prefer logic over creativity?' }, // Special case maybe? Or just Yes = Logic, No = Creativity. Let's stick to simple Yes/No for "Prefer Logic"
    ];

    const handleChange = (key, val) => {
        updateData({ ...data, interests: { ...(data.interests || {}), [key]: val } });
    };

    return (
        <StepWrapper
            title="Interest Signals"
            description="Help us understand what excites you."
            onNext={onNext}
            onBack={onBack}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {interests.map(item => (
                    <InterestCard
                        key={item.key}
                        label={item.label}
                        value={data.interests?.[item.key]}
                        onChange={(val) => handleChange(item.key, val)}
                    />
                ))}
            </div>
        </StepWrapper>
    );
};

export default InterestStep;
