import React from 'react';

import classes from './BetaBlock.module.css';

export const BetaBlock = () => (
  <div className={classes.container}>
    <div className={classes.title}>Beta</div>
    <div className={classes.desc}>
      Komponenten er under utvikling. Dette kan medføre breaking-changes i
      patch/minor versjon av kodepakker.
    </div>
  </div>
);
