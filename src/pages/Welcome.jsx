import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import SurveyChoiceModal from '../components/common/SurveyChoiceModal';
import './Welcome.css';

import VisitorCounter from '../components/common/VisitorCounter';

const Welcome = () => {
  const navigate = useNavigate();
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="welcome-container">
      {/* Third accent orb */}
      <div className="welcome-orb-accent" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          className="welcome-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="welcome-badge" variants={itemVariants}>
            <Zap size={14} color="var(--secondary-light)" />
            <span className="welcome-badge-text">AI-Powered Career Guidance</span>
          </motion.div>

          <motion.h1 className="welcome-title" variants={itemVariants}>
            Discover Your <br />
            <span className="gradient-text">True Potential</span>
          </motion.h1>

          <motion.p className="welcome-description" variants={itemVariants}>
            Stop guessing your future. Let our AI analyze your skills, interests, and personality to build a personalized career roadmap.
          </motion.p>

          <motion.button
            className="btn-primary welcome-cta"
            onClick={() => setShowChoiceModal(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            variants={itemVariants}
          >
            Start Your Journey <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>

      <VisitorCounter />

      <SurveyChoiceModal
        isOpen={showChoiceModal}
        onClose={() => setShowChoiceModal(false)}
      />
    </div>
  );
};

export default Welcome;
