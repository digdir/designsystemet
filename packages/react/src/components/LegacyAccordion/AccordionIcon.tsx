import React from 'react';
import cn from 'classnames';

import classes from './LegacyAccordionIcon.module.css';
import { useLegacyAccordionContext } from './Context';
import { Arrow, CircleArrow } from './icons';

const LegacyAccordionIcon = () => {
  const { onClick, open, iconVariant } = useLegacyAccordionContext();
  const props = {
    className: cn(classes.LegacyAccordionIcon, open && classes.opened),
    onClick,
  };
  switch (iconVariant) {
    case 'primary':
      return <Arrow {...props} />;
    case 'secondary':
      return <CircleArrow {...props} />;
  }
};

LegacyAccordionIcon.displayName = 'LegacyAccordionIcon';

export { LegacyAccordionIcon };
