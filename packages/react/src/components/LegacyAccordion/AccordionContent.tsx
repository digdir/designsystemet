import React from 'react';

import { useLegacyAccordionContext } from './Context';

export interface LegacyAccordionContentProps {
  children?: React.ReactNode;
}

const LegacyAccordionContent = ({ children }: LegacyAccordionContentProps) => {
  const { open, contentId, headerId } = useLegacyAccordionContext();

  return (
    <div>
      {open && (
        <div
          aria-expanded={open}
          id={contentId}
          aria-labelledby={headerId}
        >
          {children}
        </div>
      )}
    </div>
  );
};

LegacyAccordionContent.displayName = 'LegacyAccordionContent';

export { LegacyAccordionContent };
