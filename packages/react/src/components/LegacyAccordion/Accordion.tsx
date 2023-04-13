import React, { useId } from 'react';

import type { AccordionClickHandler, AccordionIcons } from './Context';
import { AccordionContext } from './Context';
import classes from './Accordion.module.css';

export interface AccordionProps {
  children?: React.ReactNode;
  onClick: AccordionClickHandler;
  open: boolean;
  iconVariant?: AccordionIcons;
}

const Accordion = ({
  children,
  open,
  onClick,
  iconVariant = 'primary',
}: AccordionProps) => {
  const headerId = useId();
  const contentId = useId();
  return (
    <div className={classes.accordion}>
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

Accordion.displayName = 'Accordion';

export { Accordion };
