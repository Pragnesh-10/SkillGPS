import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import SurveyChoiceModal from '../components/common/SurveyChoiceModal';
import './Welcome.css';


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
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 25, mass: 1 } }
  };

  return (
    <div className="welcome-container">
      <Helmet>
        <title>SkillGPS — AI Career Guidance & Roadmaps</title>
        <meta name="description" content="Stop guessing your future. SkillGPS uses AI to analyze your skills and build personalized learning roadmaps for Data Science, Frontend, Backend, and more." />
        <link rel="canonical" href="https://skillgps.vercel.app/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SkillGPS",
              "url": "https://skillgps.vercel.app/",
              "description": "AI-powered career guidance platform providing personalized learning roadmaps, curated courses, and expert mentorship.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "All"
            }
          `}
        </script>
      </Helmet>

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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            Start Your Journey <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>


      <SurveyChoiceModal
        isOpen={showChoiceModal}
        onClose={() => setShowChoiceModal(false)}
      />
    </div>
  );
};

export default Welcome;
