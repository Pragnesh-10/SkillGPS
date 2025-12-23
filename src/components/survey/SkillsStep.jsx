import React, { useState } from 'react';
import StepWrapper from './StepWrapper';

const MultiSelect = ({ label, options, selected, onToggle }) => (
    <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)' }}>{label}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onToggle(opt)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${selected.includes(opt) ? 'var(--primary)' : 'var(--border-light)'}`,
                        background: selected.includes(opt) ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: selected.includes(opt) ? 'var(--primary)' : 'var(--text-muted)',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                    }}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

const SkillsStep = ({ data, updateData, onNext, onBack }) => {
    const languages = ['Python', 'Java', 'JavaScript', 'C++', 'SQL', 'R', 'Swift', 'Go', 'PHP'];
    const tools = ['VS Code', 'Git', 'Figma', 'Excel', 'Tableau', 'Docker', 'AWS', 'Photoshop'];
    const subjects = ['Mathematics', 'Physics', 'Computer Science', 'Art', 'Psychology', 'Statistics', 'Economics'];

    const toggleSelection = (category, item) => {
        const currentList = data[category] || [];
        const newList = currentList.includes(item)
            ? currentList.filter(i => i !== item)
            : [...currentList, item];
        updateData({ [category]: newList });
    };

    const handleNext = () => {
        // Optional: validation
        onNext();
    };

    return (
        <StepWrapper
            title="Skills & Exposure"
            description="Tell us what you already know and what you enjoy."
            onNext={handleNext}
            onBack={onBack}
        >
            <MultiSelect
                label="Languages you know"
                options={languages}
                selected={data.languages || []}
                onToggle={(item) => toggleSelection('languages', item)}
            />

            <MultiSelect
                label="Tools you have used"
                options={tools}
                selected={data.tools || []}
                onToggle={(item) => toggleSelection('tools', item)}
            />

            <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)' }}>Subjects you enjoyed</label>
                <input
                    type="text"
                    placeholder="e.g. Linear Algebra, Algorithms (Optional)"
                    value={data.enjoyedSubjects || ''}
                    onChange={(e) => updateData({ enjoyedSubjects: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        outline: 'none'
                    }}
                />
            </div>
        </StepWrapper>
    );
};

export default SkillsStep;
