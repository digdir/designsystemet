import React from 'react';

import classes from './TokenColor.module.css';
import cn from 'classnames';

interface TokenColorProps {
  value: string;
}

const TokenColor = ({ value }: TokenColorProps) => {
  return (
    <div className={classes.test}>
      <div
        style={{ backgroundColor: value }}
        className={classes.color}
      ></div>
    </div>
  );
};

export { TokenColor };
