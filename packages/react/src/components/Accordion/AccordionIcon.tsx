import React from 'react';
import cn from 'classnames';

import classes from './AccordionIcon.module.css';
import { useAccordionContext } from './Context';
import { Arrow, CircleArrow } from './icons';

const AccordionIcon = () => {
  const { onClick, open, iconVariant } = useAccordionContext();
  const props = {
    className: cn(classes.accordionIcon, open && classes.opened),
    onClick,
  };
  switch (iconVariant) {
    case 'primary':
      return <Arrow {...props} />;
    case 'secondary':
      return <CircleArrow {...props} />;
  }
};

AccordionIcon.displayName = 'AccordionIcon';

export { AccordionIcon };
