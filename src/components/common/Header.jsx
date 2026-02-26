
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, LogOut, Users, CreditCard, Share2, Menu, X } from 'lucide-react';
import MenuItem from './MenuItem';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleMenuClick = (path) => {
        setMenuOpen(false);
        setMobileNavOpen(false);
        navigate(path);
    };

    const handleReferral = () => {
        alert('Referral link copied to clipboard!');
    };

    if (location.pathname === '/' || location.pathname === '/survey' || location.pathname === '/login') {
        return null;
    }

    return (
        <>
            <header className="global-header">
                <div className="container header-container">
                    <div
                        onClick={() => navigate('/')}
                        className="logo-container"
                    >
                        <img src="/logo.png" alt="SkillGPS" />
                        SkillGPS
                    </div>

                    <div className="header-right">
                        <nav className="nav-links">
                            <Link to="/experts" className={`nav-link ${location.pathname === '/experts' ? 'active' : ''}`}>
                                Experts
                            </Link>
                            <button onClick={handleReferral} className="nav-link">
                                Refer Friends
                            </button>
                        </nav>

                        <div className="user-menu-wrapper">
                            <button
                                onClick={toggleMenu}
                                className="user-menu-btn"
                                aria-label="User Menu"
                            >
                                <User size={20} />
                            </button>

                            {menuOpen && (
                                <div className="user-dropdown">
                                    <MenuItem icon={Users} label="Experts" onClick={() => handleMenuClick('/experts')} />
                                    <MenuItem icon={CreditCard} label="Subscription" onClick={() => handleMenuClick('/subscription')} />
                                    <MenuItem icon={Share2} label="Refer Now" onClick={handleReferral} />
                                    <div className="dropdown-separator"></div>
                                    <MenuItem icon={LogOut} label="Log Out" onClick={() => {
                                        localStorage.removeItem('isAuthenticated');
                                        navigate('/');
                                    }} danger />
                                </div>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="hamburger-btn"
                            onClick={() => setMobileNavOpen(true)}
                            aria-label="Open navigation"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile fullscreen nav */}
            <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}>
                <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
                    <X size={24} />
                </button>
                <Link to="/dashboard" className="nav-link" onClick={() => setMobileNavOpen(false)}>Dashboard</Link>
                <Link to="/progress" className="nav-link" onClick={() => setMobileNavOpen(false)}>Progress</Link>
                <Link to="/experts" className="nav-link" onClick={() => setMobileNavOpen(false)}>Experts</Link>
                <Link to="/subscription" className="nav-link" onClick={() => setMobileNavOpen(false)}>Subscription</Link>
                <button className="nav-link" onClick={() => { handleReferral(); setMobileNavOpen(false); }}>Refer Friends</button>
                <button
                    className="nav-link"
                    style={{ color: 'var(--danger)', marginTop: 'var(--space-4)' }}
                    onClick={() => {
                        localStorage.removeItem('isAuthenticated');
                        setMobileNavOpen(false);
                        navigate('/');
                    }}
                >
                    Log Out
                </button>
            </div>
        </>
    );
};

export default Header;
