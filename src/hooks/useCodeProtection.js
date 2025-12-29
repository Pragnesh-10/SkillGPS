
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

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
};
