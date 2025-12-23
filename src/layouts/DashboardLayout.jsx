import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, TrendingUp, Users, CreditCard, Share2 } from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation(); // To highlight active links or pass state
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleMenuClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(10, 10, 15, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border-light)',
                padding: '16px 20px'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                        onClick={() => navigate('/dashboard')}
                        style={{ fontWeight: '700', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <span style={{ height: '12px', width: '12px', borderRadius: '50%', background: 'var(--secondary)' }}></span>
                        CareerAI
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={toggleMenu}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--gradient-main)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}
                        >
                            <User size={20} />
                        </button>

                        {menuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '50px',
                                right: '0',
                                width: '240px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                padding: '8px',
                                overflow: 'hidden'
                            }}>
                                <MenuItem icon={TrendingUp} label="Progress" onClick={() => handleMenuClick('/progress')} />
                                <MenuItem icon={Users} label="Experts" onClick={() => handleMenuClick('/experts')} />
                                <MenuItem icon={CreditCard} label="Subscription" onClick={() => handleMenuClick('/subscription')} />
                                <MenuItem icon={Share2} label="Refer Now" onClick={() => alert('Referral code copied!')} />
                                <div style={{ height: '1px', background: 'var(--border-light)', margin: '8px 0' }}></div>
                                <MenuItem icon={LogOut} label="Log Out" onClick={() => navigate('/')} danger />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ padding: '24px 0' }}>
                <Outlet />
            </main>
        </div>
    );
};

const MenuItem = ({ icon: Icon, label, onClick, danger }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            textAlign: 'left',
            color: danger ? '#ef4444' : 'var(--text-main)',
            borderRadius: 'var(--radius-sm)',
            transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
    >
        <Icon size={18} />
        {label}
    </button>
);

export default DashboardLayout;
