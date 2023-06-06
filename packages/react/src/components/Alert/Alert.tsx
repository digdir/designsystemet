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
  info: <InformationSquareFillIcon className={classes.icon} />,
  warning: <ExclamationmarkTriangleFillIcon className={classes.icon} />,
  success: <CheckmarkCircleFillIcon className={classes.icon} />,
  danger: <XMarkOctagonFillIcon className={classes.icon} />,
};

type Severity = 'info' | 'warning' | 'success' | 'danger';

export type AlertProps = {
  /** Description of what myProp does in the component */
  severity?: Severity;
} & HTMLAttributes<HTMLDivElement>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ severity = 'info', children, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={cn(classes.alert, classes[severity], rest.className)}
        ref={ref}
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
