import React from 'react';
import { XMarkIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';

import classes from './ComponentUsage.module.css';

export interface ComponentUsageProps {
  type?: 'success' | 'danger';
  component: never;
  args: never;
}

export function Usage({
  type = 'success',
  component,
  args,
}: ComponentUsageProps) {
  return (
    <div
      className={cn(classes.ComponentUsage, classes[`ComponentUsage--${type}`])}
    >
      <div className={classes.box}>
        {type === 'success' ? (
          <div className={classes.iconContainer}>
            <CheckmarkIcon
              fontSize={20}
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
            <XMarkIcon
              fontSize={20}
              color='white'
            />
          </div>
        )}
        <div className={classes.content}>
          {React.cloneElement(React.createElement(component), args)}
        </div>
      </div>
    </div>
  );
}

Usage.displayName = 'Usage';
