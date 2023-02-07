import React, { useId } from 'react';

import type { AccordionClickHandler } from './Context';
import { AccordionIconVariant, AccordionContext } from './Context';
import classes from './Accordion.module.css';

export interface AccordionProps {
  children?: React.ReactNode;
  onClick: AccordionClickHandler;
  open: boolean;
  iconVariant?: AccordionIconVariant;
}

const Accordion = ({
  children,
  open,
  onClick,
  iconVariant = AccordionIconVariant.Primary,
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
