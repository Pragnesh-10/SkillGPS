import React from 'react';
import StepWrapper from './StepWrapper';

const Slider = ({ label, value, onChange }) => (
    <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ color: 'var(--text-main)' }}>{label}</label>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{value}/10</span>
        </div>
        <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{
                width: '100%',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
            }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Beginner</span>
            <span>Expert</span>
        </div>
    </div>
);

const ConfidenceStep = ({ data, updateData, onNext, onBack }) => {
    const handleChange = (field, val) => {
        updateData({ ...data, confidence: { ...(data.confidence || {}), [field]: val } });
    };

    const conf = data.confidence || { math: 5, coding: 5, communication: 5 };

    return (
        <StepWrapper
            title="Self Assessment"
            description="Rate your confidence level in these areas."
            onNext={onNext}
            onBack={onBack}
            isLastStep={true}
        >
            <Slider
                label="Mathematics"
                value={conf.math}
                onChange={(val) => handleChange('math', val)}
            />
            <Slider
                label="Coding / Programming"
                value={conf.coding}
                onChange={(val) => handleChange('coding', val)}
            />
            <Slider
                label="Communication"
                value={conf.communication}
                onChange={(val) => handleChange('communication', val)}
            />
        </StepWrapper>
    );
};

export default ConfidenceStep;
