import React from 'react';
import { ErrorStroke, SuccessStroke } from '@navikt/ds-icons';
import cn from 'classnames';

import classes from './ComponentUsage.module.css';

export interface ComponentUsageProps {
  children?: React.ReactNode;
  title?: string;
  desc?: string;
  type: 'success' | 'danger';
}

export function ComponentUsage({
  children,
  title = 'string',
  desc,
  type = 'success',
}: ComponentUsageProps) {
  return (
    <div
      className={cn(classes.ComponentUsage, classes[`ComponentUsage--${type}`])}
    >
      <div className={classes.textContainer}>
        <div className={classes.title}>{title}</div>
        <div className={classes.desc}>{desc}</div>
      </div>

      <div className={classes.box}>
        {type === 'success' ? (
          <div className={classes.iconContainer}>
            <SuccessStroke
              fontSize={24}
              color='white'
            />
          </div>
        ) : (
          <div
            className={cn(
              classes.iconContainer,
              classes['iconContainer--danger'],
            )}
          >
            <ErrorStroke
              fontSize={24}
              color='white'
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

ComponentUsage.displayName = 'ComponentUsage';
