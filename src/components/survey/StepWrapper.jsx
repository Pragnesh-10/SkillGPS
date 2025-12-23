import React from 'react';

const StepWrapper = ({ title, description, children, onNext, onBack, isLastStep }) => {
    return (
        <div className="card" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>{title}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{description}</p>
            </div>

            <div style={{ marginBottom: '40px' }}>
                {children}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                {onBack ? (
                    <button onClick={onBack} style={{ padding: '12px 24px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Back
                    </button>
                ) : (
                    <div></div>
                )}

                <button className="btn-primary" onClick={onNext}>
                    {isLastStep ? 'Finish' : 'Next'}
                </button>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default StepWrapper;
