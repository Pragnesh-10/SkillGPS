import React, { useState } from 'react';
import StepWrapper from './StepWrapper';

const BackgroundStep = ({ data, updateData, onNext }) => {
    const handleChange = (field, value) => {
        updateData({ ...data, [field]: value });
    };

    const handleNext = () => {
        // Simple validation
        if (!data.education || !data.year) {
            alert('Please fill in all fields'); // Basic alert for now, can be UI feedback later
            return;
        }
        onNext();
    };

    return (
        <StepWrapper
            title="Background Check"
            description="Let's start with your current academic status."
            onNext={handleNext}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Education Level</label>
                    <select
                        value={data.education || ''}
                        onChange={(e) => handleChange('education', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-main)',
                            outline: 'none'
                        }}
                    >
                        <option value="">Select Level</option>
                        <option value="highschool">High School</option>
                        <option value="undergrad">Undergraduate</option>
                        <option value="grad">Graduate</option>
                        <option value="working">Working Professional</option>
                    </select>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Major / Stream</label>
                    <input
                        type="text"
                        placeholder="e.g. Computer Science, Commerce, Biology"
                        value={data.major || ''}
                        onChange={(e) => handleChange('major', e.target.value)}
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

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Year of Study</label>
                    <select
                        value={data.year || ''}
                        onChange={(e) => handleChange('year', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-main)',
                            outline: 'none'
                        }}
                    >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="final">Final Year</option>
                        <option value="graduated">Graduated</option>
                    </select>
                </div>
            </div>
        </StepWrapper>
    );
};

export default BackgroundStep;
