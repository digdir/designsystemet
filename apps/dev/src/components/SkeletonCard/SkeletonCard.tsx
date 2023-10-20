import classes from './SkeletonCard.module.css';
import cn from 'classnames';

export const SkeletonCard = () => {
  return (
    <div className={classes.card}>
      <div className={classes.element}></div>
      <div className={cn(classes.element, classes.shortElement)}></div>
    </div>
  );
};
