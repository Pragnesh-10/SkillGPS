
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
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I / Cmd+Option+I (Inspect)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'i') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+J / Cmd+Option+J (Console)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'j') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
                e.preventDefault();
                return false;
            }

            // Ctrl+U / Cmd+U (View Source)
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                return false;
            }
        };

        // Detect DevTools by checking window size difference
        let devtoolsOpen = false;
        const threshold = 160;

        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    // Clear localStorage sensitive data when DevTools detected
                    localStorage.removeItem('resumeData');
                }
            } else {
                devtoolsOpen = false;
            }
        };

        // Override console methods in production
        if (process.env.NODE_ENV === 'production') {
            const noop = () => { };
            window.console.log = noop;
            window.console.debug = noop;
            window.console.info = noop;
            window.console.warn = noop;
        }

        // Detect debugger usage
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

        // Check periodically for DevTools
        const devToolsInterval = setInterval(detectDevTools, 1000);
        const debuggerInterval = setInterval(checkDebugger, 3000);

        // Disable text selection to make copying harder
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.msUserSelect = 'none';

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(devToolsInterval);
            clearInterval(debuggerInterval);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            // Restore text selection
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.msUserSelect = '';
        };
    }, []);
};
