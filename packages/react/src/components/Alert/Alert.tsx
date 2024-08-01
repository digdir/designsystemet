import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Paragraph } from '../Typography';

const icons: Record<
  Severity,
  { Icon: typeof InformationSquareFillIcon; title: string }
> = {
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
  /**
   * Sets color & icon according to severity
   * @default info
   */
  severity?: Severity;
  /**
   * Sets `title` on the icon.
   *
   * Use this to inform screenreaders of severity.
   * Defaults to Norwegian.
   */
  iconTitle?: string;
  /**
   * Sets the size of the alert.
   * Does not affect font size.
   *
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
} & HTMLAttributes<HTMLDivElement>;

/**
 * Alerts are used to inform users about important information, warnings, errors, or success.
 * @example
 * <Alert severity='info'>Dette er en informasjonsmelding</Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { severity = 'info', iconTitle, children, size = 'md', className, ...rest },
    ref,
  ) => {
    const { Icon, title } = icons[severity];

    return (
      <div
        ref={ref}
        className={cl(
          'ds-alert',
          `ds-alert--${size}`,
          `ds-alert--${severity}`,
          className,
        )}
        {...rest}
      >
        <>
          <Icon title={iconTitle || title} className='ds-alert__icon' />
          <Paragraph asChild size={size} className='ds-alert__content'>
            <span>{children}</span>
          </Paragraph>
        </>
      </div>
    );
  },
);

Alert.displayName = 'Alert';
