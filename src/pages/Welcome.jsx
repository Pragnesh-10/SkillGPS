import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
      
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(10, 10, 15, 0) 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }}></div>

      <div style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Sparkles size={16} color="#ec4899" />
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>AI-Powered Career Guidance</span>
      </div>

      <h1 style={{ fontSize: '4rem', fontWeight: '700', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
        Discover Your <br />
        <span className="gradient-text">True Potential</span>
      </h1>

      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '48px' }}>
        Stop guessing your future. Let our AI analyze your skills, interests, and personality to build a personalized career roadmap for you.
      </p>

      <button onClick={() => navigate('/survey')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', padding: '16px 32px' }}>
        Start Your Journey <ArrowRight size={20} />
      </button>

      <div style={{ marginTop: '80px', display: 'flex', gap: '40px', justifyContent: 'center', opacity: 0.7 }}>
        <div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>50+</h3>
          <p style={{ color: 'var(--text-muted)' }}>Career Paths</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>10k+</h3>
          <p style={{ color: 'var(--text-muted)' }}>Learning Resources</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>Verified</h3>
          <p style={{ color: 'var(--text-muted)' }}>Expert Network</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
