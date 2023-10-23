import cn from 'classnames';
import React from 'react';

import classes from './SkeletonCard.module.css';

export const SkeletonCard = () => {
  return (
    <div className={classes.card}>
      <div className={classes.element}></div>
      <div className={cn(classes.element, classes.shortElement)}></div>
    </div>
  );
};
