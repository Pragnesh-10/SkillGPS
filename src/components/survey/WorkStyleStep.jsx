import React from 'react';
import StepWrapper from './StepWrapper';

const ChoicePair = ({ label, optionA, optionB, value, onChange }) => (
    <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)' }}>{label}</label>
        <div style={{ display: 'flex', gap: '16px' }}>
            <button
                onClick={() => onChange(optionA)}
                style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: value === optionA ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    background: value === optionA ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)',
                    color: value === optionA ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                }}
            >
                {optionA}
            </button>
            <button
                onClick={() => onChange(optionB)}
                style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: value === optionB ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    background: value === optionB ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)',
                    color: value === optionB ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                }}
            >
                {optionB}
            </button>
        </div>
    </div>
);

const WorkStyleStep = ({ data, updateData, onNext, onBack }) => {
    const handleChange = (field, val) => {
        updateData({ ...data, workStyle: { ...(data.workStyle || {}), [field]: val } });
    };

    const ws = data.workStyle || {};

    return (
        <StepWrapper
            title="Work Style"
            description="How do you prefer to work?"
            onNext={onNext}
            onBack={onBack}
        >
            <ChoicePair
                label="Environment"
                optionA="Solo"
                optionB="Team"
                value={ws.environment}
                onChange={(val) => handleChange('environment', val)}
            />
            <ChoicePair
                label="Structure"
                optionA="Structured"
                optionB="Flexible"
                value={ws.structure}
                onChange={(val) => handleChange('structure', val)}
            />
            <ChoicePair
                label="Role Type"
                optionA="Desk Job"
                optionB="Dynamic"
                value={ws.roleType}
                onChange={(val) => handleChange('roleType', val)}
            />
        </StepWrapper>
    );
};

export default WorkStyleStep;
