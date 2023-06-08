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

const icons = {
  info: {
    Icon: InformationSquareFillIcon,
    title: 'Informasjon',
  },
  warning: { Icon: ExclamationmarkTriangleFillIcon, title: 'Advarsel' },
  success: { Icon: CheckmarkCircleFillIcon, title: 'Suksess' },
  danger: {
    Icon: XMarkOctagonFillIcon,
    title: 'Feil',
  },
};

type Severity = 'info' | 'warning' | 'success' | 'danger';

export type AlertProps = {
  /** Sets color & icon according to severity */
  severity?: Severity;
  /** Adds a shadow to elevate the component */
  elevated?: boolean;
  /** Sets `title` on the icon.
   *
   * Use this to inform screenreaders of severity.
   *  Defaults to Norwegian. */
  iconTitle?: string;
} & HTMLAttributes<HTMLDivElement>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ severity = 'info', elevated, iconTitle, children, ...rest }, ref) => {
    const { Icon, title } = icons[severity];

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
          <Icon
            title={iconTitle || title}
            className={classes.icon}
          />
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
