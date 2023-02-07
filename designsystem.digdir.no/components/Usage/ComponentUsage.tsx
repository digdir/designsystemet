import React from 'react';
import { ErrorStroke, SuccessStroke } from '@navikt/ds-icons';
import cn from 'classnames';

import classes from './ComponentUsage.module.css';

export interface ComponentUsageProps {
  title?: string;
  desc?: string;
  type?: 'success' | 'danger';
  component: never;
  args: never;
}

export function Usage({
  title = 'string',
  desc,
  type = 'success',
  component,
  args,
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
            <ErrorStroke
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
