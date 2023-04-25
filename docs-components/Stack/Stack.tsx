import type { HTMLAttributes } from 'react';
import React from 'react';

import classes from './Stack.module.css';

export const Stack = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classes.stack}
    {...props}
  ></div>
);
