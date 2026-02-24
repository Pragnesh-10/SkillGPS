import { useState, useEffect } from 'react';

const VisitorCounter = () => {
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            const base = import.meta.env.VITE_ML_API_BASE || 'http://localhost:8000';
            try {
                const res = await fetch(`${base}/visitor-count`);
                if (res.ok) {
                    const data = await res.json();
                    setCount(data.count);
                }
            } catch (err) {
                console.warn('Failed to fetch visitor count:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, []);

    if (loading || count === null) return null;

    return (
        <div className="visitor-counter">
            Total Visitors: {count.toLocaleString()}
        </div>
    );
};

export default VisitorCounter;
