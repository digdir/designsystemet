import type { ReactNode } from 'react';

import classes from './Grid.module.css';

interface GridProps {
  children: ReactNode;
}

const Grid = ({ children }: GridProps) => {
  return <div className={classes.grid}>{children}</div>;
};

export { Grid };
