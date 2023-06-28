import React from 'react';

import classes from './Grid.module.css';

interface GridProps {
  children: React.ReactNode;
}

const Grid = ({ children }: GridProps) => {
  return <div className={classes.grid}>{children}</div>;
};

export { Grid };
