import React from 'react';
import StepWrapper from './StepWrapper';

const InterestCard = ({ label, value, onChange }) => {
    return (
        <div className="interest-card">
            <span className="interest-label">{label}</span>
            <div className="interest-options">
                <button
                    className={`interest-btn interest-btn-yes ${value === true ? 'active' : ''}`}
                    onClick={() => onChange(true)}
                >
                    Yes
                </button>
                <button
                    className={`interest-btn interest-btn-no ${value === false ? 'active' : ''}`}
                    onClick={() => onChange(false)}
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
        { key: 'logic', label: 'Do you prefer logic over creativity?' },
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
