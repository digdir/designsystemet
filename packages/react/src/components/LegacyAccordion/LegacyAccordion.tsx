import React, { useId } from 'react';

import type { LegacyAccordionClickHandler, AccordionIcons } from './Context';
import { AccordionContext } from './Context';
import classes from './LegacyAccordion.module.css';

export interface LegacyAccordionProps {
  children?: React.ReactNode;
  onClick: LegacyAccordionClickHandler;
  open: boolean;
  iconVariant?: AccordionIcons;
}

const LegacyAccordion = ({
  children,
  open,
  onClick,
  iconVariant = 'primary',
}: LegacyAccordionProps) => {
  const headerId = useId();
  const contentId = useId();
  return (
    <div className={classes.legacyAccordion}>
      <AccordionContext.Provider
        value={{
          onClick,
          open,
          headerId,
          contentId,
          iconVariant,
        }}
      >
        {children}
      </AccordionContext.Provider>
    </div>
  );
};

LegacyAccordion.displayName = 'LegacyAccordion';

export { LegacyAccordion };
