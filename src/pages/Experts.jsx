import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Star } from 'lucide-react';
import './Experts.css';

const experts = [
    { id: 1, name: 'Sarah Chen', role: 'Staff Data Scientist', company: 'Google', exp: '8 years', domain: 'Data Scientist' },
    { id: 2, name: 'David Miller', role: 'Senior Backend Eng', company: 'Netflix', exp: '10 years', domain: 'Backend Developer' },
    { id: 3, name: 'Emily Zhang', role: 'Product Lead', company: 'Airbnb', exp: '7 years', domain: 'Product Manager' },
    { id: 4, name: 'Michael Brown', role: 'Principle Engineer', company: 'Amazon', exp: '12 years', domain: 'Cloud Engineer' },
];

const Experts = () => {
    const navigate = useNavigate();
    const [isPremium, setIsPremium] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [meetingTime, setMeetingTime] = useState('');

    useEffect(() => {
        const premiumStatus = localStorage.getItem('isPremium') === 'true';
        setIsPremium(premiumStatus);
    }, []);

    const handleConnect = (expert) => {
        if (!isPremium) {
            navigate('/subscription');
        } else {
            setSelectedExpert(expert);
            setShowModal(true);
        }
    };

    const handleConfirmMeeting = (e) => {
        e.preventDefault();
        if (!meetingTime) {
            alert('Please select a time for the meeting.');
            return;
        }

        const emailContent = `
        Subject: Meeting Confirmation with ${selectedExpert.name} - SkillGPS

        Dear User,

        This email confirms your request to connect with ${selectedExpert.name} (${selectedExpert.role} at ${selectedExpert.company}).
        
        Meeting Details:
        Expert: ${selectedExpert.name}
        Topic: Career Guidance & Mentorship
        Scheduled Time: ${new Date(meetingTime).toLocaleString()}
        
        Please be ready 5 minutes prior to the scheduled time. A Google Meet link will be shared shortly.

        Best regards,
        The SkillGPS Team
        `;

        console.log("SENDING EMAIL...", emailContent);

        setShowModal(false);
        setMeetingTime('');
        setSelectedExpert(null);

        alert(`Request sent to ${selectedExpert.name}! A confirmation email has been sent to you.`);
    };

    return (
        <div className="container" style={{ position: 'relative' }}>
            <div className="page-header">
                <h1>Talk to Industry Experts</h1>
                <p>Get 1:1 guidance, mock interviews, and resume reviews.</p>
            </div>

            <div className="experts-grid">
                {experts.map(expert => (
                    <div key={expert.id} className="card expert-card">
                        <div className="expert-card-profile">
                            <div className="expert-avatar">
                                {expert.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="expert-name">{expert.name}</h3>
                                <p className="expert-role">{expert.role} at {expert.company}</p>
                            </div>
                        </div>

                        <div className="expert-meta">
                            <span>Exp: {expert.exp}</span>
                            <span className="expert-meta-separator">•</span>
                            <span>{expert.domain}</span>
                        </div>

                        <button
                            className={`expert-connect-btn ${isPremium ? 'unlocked' : 'locked'}`}
                            onClick={() => handleConnect(expert)}
                        >
                            {isPremium ? 'Connect Now' : (
                                <>Connect <Lock size={16} /></>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <form onSubmit={handleConfirmMeeting} className="meeting-form">
                            <h2>Schedule with {selectedExpert?.name}</h2>

                            <div>
                                <label className="label">Select Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={meetingTime}
                                    onChange={(e) => setMeetingTime(e.target.value)}
                                    className="input"
                                    min={new Date().toISOString().slice(0, 16)}
                                    required
                                />
                            </div>

                            <div className="meeting-form-actions">
                                <button
                                    type="button"
                                    className="meeting-cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="meeting-confirm-btn">
                                    Confirm Meeting
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Experts;
