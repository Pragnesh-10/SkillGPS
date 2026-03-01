import { useEffect } from 'react';

export const useCodeProtection = () => {
    useEffect(() => {
        // Disable right-click context menu
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable common developer tool shortcuts
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();

            // F12
            if (key === 'f12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I / Cmd+Option+I (Inspect)
            if ((e.ctrlKey && e.shiftKey && key === 'i') || (e.metaKey && e.altKey && key === 'i')) {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+J / Cmd+Option+J (Console)
            if ((e.ctrlKey && e.shiftKey && key === 'j') || (e.metaKey && e.altKey && key === 'j')) {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
            if ((e.ctrlKey && e.shiftKey && key === 'c') || (e.metaKey && e.altKey && key === 'c')) {
                e.preventDefault();
                return false;
            }

            // Ctrl+U / Cmd+U (View Source)
            if ((e.ctrlKey || e.metaKey) && key === 'u') {
                e.preventDefault();
                return false;
            }
        };

        // Detect DevTools by checking window size difference
        let devtoolsOpen = false;
        const threshold = 160;

        const detectDevTools = () => {
            // Check if window is detached or DevTools is docked
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    // Clear localStorage sensitive data when DevTools detected
                    localStorage.removeItem('resumeData');
                    // Aggressive block
                    document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#0f172a;color:white;font-family:sans-serif;text-align:center;"><h2>Developer tools are not allowed on this site.</h2><br/><p>Please close developer tools and refresh the page.</p></div>';
                    // Infinite debugger trap
                    setInterval(() => {
                        Function('debugger')();
                    }, 50);
                }
            } else {
                devtoolsOpen = false;
            }
        };

        // Override console methods in production
        if (process.env.NODE_ENV === 'production' || import.meta.env.PROD) {
            const noop = () => { };
            window.console.log = noop;
            window.console.debug = noop;
            window.console.info = noop;
            window.console.warn = noop;
            window.console.error = noop;
        }

        // Detect debugger usage aggressively
        const checkDebugger = () => {
            const startTime = performance.now();
            debugger; // This will pause if DevTools is open
            const endTime = performance.now();

            // If execution was paused, likely debugger is open
            if (endTime - startTime > 100) {
                // Clear sensitive data
                localStorage.removeItem('resumeData');
            }
        };

        // Check aggressively for DevTools
        const devToolsInterval = setInterval(detectDevTools, 500);
        const debuggerInterval = setInterval(checkDebugger, 1000);

        // Disable text selection to make copying harder
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.msUserSelect = 'none';

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(devToolsInterval);
            clearInterval(debuggerInterval);
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            // Restore text selection
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.msUserSelect = '';
        };
    }, []);
};
