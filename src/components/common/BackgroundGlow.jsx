
import React from 'react';

const BackgroundGlow = () => {
    return (
        <>
            <div
                className="bg-glow"
                style={{
                    width: '550px',
                    height: '550px',
                    top: '5%',
                    left: '25%',
                    background: 'radial-gradient(circle, rgba(232, 168, 56, 0.10) 0%, transparent 70%)',
                }}
            />
            <div
                className="bg-glow"
                style={{
                    width: '450px',
                    height: '450px',
                    top: '55%',
                    right: '15%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
                    animationDelay: '-4s',
                    animationDuration: '12s',
                }}
            />
            <div
                className="bg-glow"
                style={{
                    width: '350px',
                    height: '350px',
                    bottom: '10%',
                    left: '10%',
                    background: 'radial-gradient(circle, rgba(244, 114, 182, 0.06) 0%, transparent 70%)',
                    animationDelay: '-7s',
                    animationDuration: '15s',
                }}
            />
        </>
    );
};

export default BackgroundGlow;
