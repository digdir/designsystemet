import React from 'react';
import cn from 'classnames';

import classes from './AccordionHeader.module.css';
import { useAccordionContext } from './Context';
import { AccordionIcon } from './AccordionIcon';

export interface AccordionHeaderProps {
  children?: React.ReactNode;
  actions?: React.ReactNode;
  subtitle?: string;
}

const AccordionHeader = ({
  children,
  actions,
  subtitle,
}: AccordionHeaderProps) => {
  const { onClick, open, headerId, contentId } = useAccordionContext();

  return (
    <div
      className={cn(classes.accordionHeader, {
        [classes.withSubtitle]: subtitle,
      })}
    >
      <AccordionIcon />
      <button
        className={classes.title}
        aria-expanded={open}
        type='button'
        onClick={onClick}
        id={headerId}
        aria-controls={contentId}
      >
        {children}
        {subtitle?.length && (
          <span
            data-testid='accordion-header-subtitle'
            className={classes.subtitle}
          >
            {subtitle}
          </span>
        )}
      </button>
      <div className={classes.actions}>{actions}</div>
    </div>
  );
};

AccordionHeader.displayName = 'AccordionHeader';

export { AccordionHeader };
