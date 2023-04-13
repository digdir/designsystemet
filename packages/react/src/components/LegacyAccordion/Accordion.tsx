import React, { useId } from 'react';

import type {
  LegacyAccordionClickHandler,
  LegacyAccordionIcons,
} from './Context';
import { LegacyAccordionContext } from './Context';
import classes from './LegacyAccordion.module.css';

export interface LegacyAccordionProps {
  children?: React.ReactNode;
  onClick: LegacyAccordionClickHandler;
  open: boolean;
  iconVariant?: LegacyAccordionIcons;
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
    <div className={classes.LegacyAccordion}>
      <LegacyAccordionContext.Provider
        value={{
          onClick,
          open,
          headerId,
          contentId,
          iconVariant,
        }}
      >
        {children}
      </LegacyAccordionContext.Provider>
    </div>
  );
};

LegacyAccordion.displayName = 'LegacyAccordion';

export { LegacyAccordion };
