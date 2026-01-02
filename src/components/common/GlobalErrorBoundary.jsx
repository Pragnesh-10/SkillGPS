import React from 'react';
import { AlertTriangle } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0a0f',
                    color: '#fff',
                    fontFamily: 'sans-serif',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Something went wrong</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '30px', maxWidth: '500px' }}>
                        We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                    </p>
                    <div style={{
                        background: '#1e1e2d',
                        padding: '15px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: '#ef4444',
                        maxWidth: '800px',
                        overflowX: 'auto',
                        border: '1px solid #3f3f46'
                    }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        <br />
                        <details>
                            <summary style={{ cursor: 'pointer', color: '#FF9933' }}>Stack Trace</summary>
                            <pre style={{ marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            marginTop: '30px',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
