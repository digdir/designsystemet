import React from 'react';

import { Container } from '../Container/Container';

import classes from './NavSection.module.css';

interface GridProps {
  children: React.ReactNode;
}

const Grid = ({ children }: GridProps) => {
  return <div className={classes.grid}>{children}</div>;
};

export { Grid };
