import React from 'react';
import cn from 'classnames';

import classes from './AccordionIcon.module.css';
import { useAccordionContext, AccordionIconVariant } from './Context';
import { Arrow, CircleArrow } from './icons';

const AccordionIcon = () => {
  const { onClick, open, iconVariant } = useAccordionContext();
  const props = {
    className: cn(classes.accordionIcon, open && classes.opened),
    onClick,
  };
  switch (iconVariant) {
    case AccordionIconVariant.Primary:
      return <Arrow {...props} />;
    case AccordionIconVariant.Secondary:
      return <CircleArrow {...props} />;
  }
};

AccordionIcon.displayName = 'AccordionIcon';

export { AccordionIcon };
