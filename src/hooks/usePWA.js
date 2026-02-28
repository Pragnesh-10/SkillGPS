// hooks/usePWA.js
// Drop this hook into your existing hooks folder and call it once in App.jsx

import { useEffect, useState } from 'react';

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // ── Register Service Worker ──────────────────────────────────────
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);
          setSwRegistered(true);

          // Check for updates every 60 seconds
          setInterval(() => reg.update(), 60_000);
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err);
        });
    }

    // ── Detect if already installed ──────────────────────────────────
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // ── Capture install prompt (Android/Desktop Chrome) ──────────────
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // ── Track successful install ─────────────────────────────────────
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('[PWA] App installed successfully!');
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Call this when user clicks your "Install App" button
  const promptInstall = async () => {
    if (!installPrompt) return;
    const { outcome } = await installPrompt.prompt();
    console.log('[PWA] Install prompt outcome:', outcome);
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  return { canInstall: !!installPrompt, isInstalled, swRegistered, promptInstall };
}
