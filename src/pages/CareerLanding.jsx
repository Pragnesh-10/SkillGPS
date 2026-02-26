import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { courses, getAllDomains } from '../data/courses';
import { ArrowLeft, ExternalLink, Star, Compass, BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import './CareerLanding.css';

const CareerLanding = () => {
    // We expect the URL to be like /careers/data-scientist
    const { domainSlug } = useParams();

    // Helper to convert slug back to domain name
    const unslugify = (slug) => {
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Helper to convert domain name to slug
    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const domains = getAllDomains();

    // Find the actual domain key in our courses object matching the slug
    const domainKey = domains.find(d => slugify(d) === domainSlug);

    // If invalid slug, redirect to home or a 404 (for now, home)
    if (!domainKey) {
        return <Navigate to="/" replace />;
    }

    const domainData = courses[domainKey];

    // Gather all courses for the schema
    const allCourses = [
        ...(domainData.beginner || []),
        ...(domainData.intermediate || []),
        ...(domainData.advanced || [])
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const CourseCard = ({ course, level }) => (
        <motion.div variants={itemVariants} className="career-course-card">
            <div className="course-header">
                <div>
                    <span className={`course-type-badge ${course.type}`}>{course.type.toUpperCase()}</span>
                    <span className="course-duration">{course.duration}</span>
                </div>
                <div className="course-rating">
                    <Star size={14} className="star-icon" /> {course.rating}
                </div>
            </div>

            <h3 className="course-title">{course.title}</h3>
            <p className="course-platform">Platform: <strong>{course.platform}</strong></p>
            <p className="course-outcome">Gain: {course.outcome}</p>

            <a href={course.link} target="_blank" rel="noopener noreferrer" className="course-link-btn">
                View Course <ExternalLink size={16} />
            </a>
        </motion.div>
    );

    return (
        <div className="career-landing-container">
            <Helmet>
                <title>{`Ultimate ${domainKey} Career Roadmap & Courses | SkillGPS`}</title>
                <meta name="description" content={`Discover the complete learning path to become a ${domainKey}. Curated free and paid courses, from beginner to advanced.`} />
                <link rel="canonical" href={`https://skillgps.vercel.app/careers/${domainSlug}`} />
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": "${domainKey} Learning Roadmap",
                            "description": "A curated list of courses to master ${domainKey}",
                            "itemListElement": [
                                ${allCourses.map((course, index) => `{
                                    "@type": "ListItem",
                                    "position": ${index + 1},
                                    "item": {
                                        "@type": "Course",
                                        "name": "${course.title}",
                                        "description": "${course.outcome}",
                                        "provider": {
                                            "@type": "Organization",
                                            "name": "${course.platform}"
                                        }
                                    }
                                }`).join(',')}
                            ]
                        }
                    `}
                </script>
            </Helmet>

            <nav className="career-nav">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} /> Back to SkillGPS
                </Link>
            </nav>

            <header className="career-hero">
                <h1>The Complete <span className="gradient-text">{domainKey}</span> Roadmap</h1>
                <p>Follow this curated step-by-step guide to master the skills needed for this career phase.</p>
            </header>

            <motion.div
                className="career-roadmap"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Beginner Section */}
                {domainData.beginner && domainData.beginner.length > 0 && (
                    <section className="roadmap-section">
                        <h2><Compass className="section-icon" /> Fundamentals (Beginner)</h2>
                        <div className="course-grid">
                            {domainData.beginner.map((course, i) => (
                                <CourseCard key={`beg-${i}`} course={course} level="Beginner" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Intermediate Section */}
                {domainData.intermediate && domainData.intermediate.length > 0 && (
                    <section className="roadmap-section">
                        <h2><BookOpen className="section-icon" /> Building Depth (Intermediate)</h2>
                        <div className="course-grid">
                            {domainData.intermediate.map((course, i) => (
                                <CourseCard key={`int-${i}`} course={course} level="Intermediate" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Advanced Section */}
                {domainData.advanced && domainData.advanced.length > 0 && (
                    <section className="roadmap-section">
                        <h2><Award className="section-icon" /> Mastery & Specialization (Advanced)</h2>
                        <div className="course-grid">
                            {domainData.advanced.map((course, i) => (
                                <CourseCard key={`adv-${i}`} course={course} level="Advanced" />
                            ))}
                        </div>
                    </section>
                )}
            </motion.div>
        </div>
    );
};

export default CareerLanding;
