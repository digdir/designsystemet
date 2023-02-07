import React from 'react';

import classes from './BetaBlock.module.css';

const BetaBlock = () => {
  return (
    <div className={classes.box}>
      <div className={classes.title}>Beta</div>
      <p className={classes.desc}>
        Komponenten er under utvikling. Dette kan medføre breaking-changes i
        patch/minor versjon av kodepakker. Vær forsiktig ved bruk og unngå
        produksjon om mulig.
      </p>
    </div>
  );
};

export { BetaBlock };
