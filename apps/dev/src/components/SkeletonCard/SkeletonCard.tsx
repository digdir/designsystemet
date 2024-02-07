import cl from 'clsx';

import classes from './SkeletonCard.module.css';

export const SkeletonCard = () => {
  return (
    <div className={classes.card}>
      <div className={classes.element}></div>
      <div className={cl(classes.element, classes.shortElement)}></div>
    </div>
  );
};
