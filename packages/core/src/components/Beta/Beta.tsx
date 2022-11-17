import React from 'react';
import { Information } from '@navikt/ds-icons';

import classes from './Beta.module.css';

export function Beta() {
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
          Week in makers may but made in practice phase text, on another
          documents people a the help for which was slid worthy differences of
          material. Duck amped of its choose unmolested lift bulk; How any I
          men's the of the sentences must back if far declined, value in the
          business.
        </div>
      </div>
    </div>
  );
}

Beta.displayName = 'Beta';
