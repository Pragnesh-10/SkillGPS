
import React from 'react';

const BackgroundGlow = () => {
    return (
        <>
            <div
                className="bg-glow"
                style={{
                    width: '500px',
                    height: '500px',
                    top: '10%',
                    left: '30%',
                    background: 'radial-gradient(circle, rgba(41, 151, 255, 0.06) 0%, transparent 70%)',
                }}
            />
        </>
    );
};

export default BackgroundGlow;
