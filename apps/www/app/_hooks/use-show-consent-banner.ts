import { useEffect, useState } from 'react';
import { hasConsent } from '~/_utils/consent-client';

export function useShowConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user already has consent
    const checkConsent = async () => {
      if (!(await hasConsent())) {
        setShowBanner(true);
      }
    };

    checkConsent();

    // Listen for consent changes (in case user updates consent in another tab)
    const handleStorageChange = async () => {
      if (!(await hasConsent())) {
        setShowBanner(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const hideBanner = () => setShowBanner(false);

  return { showBanner, hideBanner };
}
