import React from 'react';
import { motion } from 'framer-motion';

const StepWrapper = ({ title, description, children, onNext, onBack, isLastStep }) => {
    return (
        <motion.div
            className="card step-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="step-header">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>

            <div className="step-content">
                {children}
            </div>

            <div className="step-actions">
                {onBack ? (
                    <button className="btn-ghost" onClick={onBack}>
                        Back
                    </button>
                ) : (
                    <div></div>
                )}

                <button className="btn-primary" onClick={onNext}>
                    {isLastStep ? 'Finish' : 'Next'}
                </button>
            </div>
        </motion.div>
    );
};

export default StepWrapper;
