import React from 'react';
import cn from 'classnames';

import classes from './LegacyAccordionHeader.module.css';
import { useLegacyAccordionContext } from './Context';
import { LegacyAccordionIcon } from './LegacyAccordionIcon';

export interface LegacyAccordionHeaderProps {
  children?: React.ReactNode;
  actions?: React.ReactNode;
  subtitle?: string;
}

const LegacyAccordionHeader = ({
  children,
  actions,
  subtitle,
}: LegacyAccordionHeaderProps) => {
  const { onClick, open, headerId, contentId } = useLegacyAccordionContext();

  return (
    <div
      className={cn(classes.LegacyAccordionHeader, {
        [classes.withSubtitle]: subtitle,
      })}
    >
      <LegacyAccordionIcon />
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
            data-testid='LegacyAccordion-header-subtitle'
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

LegacyAccordionHeader.displayName = 'LegacyAccordionHeader';

export { LegacyAccordionHeader };
