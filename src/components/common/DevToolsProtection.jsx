import { useEffect } from 'react';

/**
 * DevTools Protection Component
 * Detects when developer tools are opened and provides basic protection
 * Note: This is NOT foolproof and can be bypassed, but deters casual users
 */
const DevToolsProtection = () => {
    useEffect(() => {
        // Disable right-click context menu
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable common developer tools keyboard shortcuts
        const handleKeyDown = (e) => {
            // F12 - DevTools
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+I or Cmd+Option+I - DevTools
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+J or Cmd+Option+J - Console
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }
            // Ctrl+U or Cmd+U - View source
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+C or Cmd+Option+C - Inspect element
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }
        };

        // Detect if DevTools is open by checking window size difference
        let devtoolsOpen = false;
        const threshold = 160;

        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    // Optional: Clear sensitive data or redirect
                    // console.warn('Developer tools detected');
                }
            } else {
                devtoolsOpen = false;
            }
        };

        // Check for DevTools every second
        const interval = setInterval(detectDevTools, 1000);

        // Attach event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            clearInterval(interval);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // This component doesn't render anything
    return null;
};

export default DevToolsProtection;
