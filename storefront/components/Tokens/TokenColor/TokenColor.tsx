import React from 'react';

import classes from './TokenColor.module.css';

interface TokenColorProps {
  value: string;
}

const TokenColor = ({ value }: TokenColorProps) => {
  return (
    <div
      style={{ backgroundColor: value }}
      className={classes.color}
    ></div>
  );
};

export { TokenColor };
