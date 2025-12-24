import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Star } from 'lucide-react';

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
            // Trigger Paywall / Navigate to Subscription
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

        // Simulate sending email
        const userEmail = "user@example.com"; // Mock user email
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

        // Close modal and reset
        setShowModal(false);
        setMeetingTime('');
        setSelectedExpert(null);

        // Show success message
        alert(`Request sent to ${selectedExpert.name}! A confirmation email has been sent to you.`);
    };

    return (
        <div className="container" style={{ position: 'relative' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Talk to Industry Experts</h1>
                <p style={{ color: 'var(--text-muted)' }}>Get 1:1 guidance, mock interviews, and resume reviews.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {experts.map(expert => (
                    <div key={expert.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                                {expert.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{expert.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{expert.role} at {expert.company}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                            <span>Exp: {expert.exp}</span>
                            <span>•</span>
                            <span>{expert.domain}</span>
                        </div>

                        <button
                            className={isPremium ? 'btn-primary' : ''}
                            style={{
                                marginTop: 'auto',
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                border: isPremium ? 'none' : '1px solid var(--border-light)',
                                background: isPremium ? 'var(--gradient-main)' : 'transparent',
                                color: isPremium ? 'white' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => handleConnect(expert)}
                        >
                            {isPremium ? 'Connect Now' : (
                                <>
                                    Connect <Lock size={16} />
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        padding: '30px',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '500px',
                        border: '1px solid #333'
                    }}>
                        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Schedule with {selectedExpert?.name}</h2>

                        <form onSubmit={handleConfirmMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Select Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={meetingTime}
                                    onChange={(e) => setMeetingTime(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #333',
                                        backgroundColor: '#2a2a2a',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    min={new Date().toISOString().slice(0, 16)}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #333',
                                        backgroundColor: 'transparent',
                                        color: '#ccc',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'var(--gradient-main)',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
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
