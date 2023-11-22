import React from 'react';

import classes from './ElementCluser.module.css';

export const ElementCluster = () => {
  return (
    <div className={classes.cluster}>
      <div className={classes.first}></div>
      <div className={classes.second}></div>
      <div className={classes.third}></div>
    </div>
  );
};
