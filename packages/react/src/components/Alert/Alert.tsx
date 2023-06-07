import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import {
  InformationSquareFillIcon,
  CheckmarkCircleFillIcon,
  XMarkOctagonFillIcon,
  ExclamationmarkTriangleFillIcon,
} from '@navikt/aksel-icons';
import cn from 'classnames';

import { Paragraph } from '..';

import classes from './Alert.module.css';

const icons: Record<Severity, JSX.Element> = {
  info: (
    <InformationSquareFillIcon
      title='info'
      className={classes.icon}
    />
  ),
  warning: (
    <ExclamationmarkTriangleFillIcon
      title='warning'
      className={classes.icon}
    />
  ),
  success: (
    <CheckmarkCircleFillIcon
      title='success'
      className={classes.icon}
    />
  ),
  danger: (
    <XMarkOctagonFillIcon
      title='danger'
      className={classes.icon}
    />
  ),
};

type Severity = 'info' | 'warning' | 'success' | 'danger';

export type AlertProps = {
  /** Sets color & icon according to severity */
  severity?: Severity;
  /** Adds a shadow to elevate the component */
  elevated?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ severity = 'info', elevated, children, ...rest }, ref) => {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          classes.alert,
          classes[severity],
          elevated && classes.elevated,
          rest.className,
        )}
      >
        <>
          {icons[severity]}
          <Paragraph
            as='span'
            className={classes.content}
          >
            {children}
          </Paragraph>
        </>
      </div>
    );
  },
);
