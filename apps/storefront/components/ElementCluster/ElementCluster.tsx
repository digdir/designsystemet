import React from 'react';
import cn from 'classnames';

import classes from './ElementCluser.module.css';

type ElementClusterProps = {
  className?: string;
};

export const ElementCluster = ({ className }: ElementClusterProps) => {
  return (
    <div className={cn(classes.cluster, [className])}>
      <div className={classes.first}></div>
      <div className={classes.second}></div>
      <div className={classes.third}></div>
    </div>
  );
};
