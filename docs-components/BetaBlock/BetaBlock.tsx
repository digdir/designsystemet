import React from 'react';
import { Information } from '@navikt/ds-icons';

import classes from './BetaBlock.module.css';

export function BetaBlock() {
  return (
    <div
      className={classes.box}
      id='beta-tag'
    >
      <div className={classes.iconContainer}>
        <Information fontSize={24} />
      </div>
      <div className={classes.TextContainer}>
        <div className={classes.title}>Beta</div>
        <div className={classes.desc}>
          Komponenten er under utvikling. Dette kan medføre breaking-changes i
          patch/minor versjon av kodepakker. Vær forsiktig ved bruk og unngå
          produksjon om mulig.
        </div>
      </div>
    </div>
  );
}

BetaBlock.displayName = 'BetaBlock';
