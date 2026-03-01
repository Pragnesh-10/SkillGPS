import { useNavigate, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={20} /> Back
            </button>

            <main className="main-content">
                <div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
