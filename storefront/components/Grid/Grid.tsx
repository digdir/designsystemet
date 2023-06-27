import React from 'react';

import classes from './Grid.module.css';
import cn from 'classnames';

interface GridProps {
  children: React.ReactNode;
}

const Grid = ({ children }: GridProps) => {
  return <div className={cn(classes.grid, 'grid')}>{children}</div>;
};

export { Grid };
