'use client';

import { useEffect } from 'react';
import { shouldIncludeSiteimprove } from '~/_utils/consent-client';

export function SiteimproveScript() {
  useEffect(() => {
    const loadScript = async () => {
      if (
        process.env.NODE_ENV === 'production' &&
        (await shouldIncludeSiteimprove())
      ) {
        const script = document.createElement('script');
        script.src =
          'https://siteimproveanalytics.com/js/siteanalyze_6255470.js';
        script.crossOrigin = 'anonymous';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadScript();
  }, []);

  return null;
}
