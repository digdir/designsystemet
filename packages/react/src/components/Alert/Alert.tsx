import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Paragraph } from '../Typography';

export type AlertProps = {
  /**
   * Sets color and icon.
   * @default info
   */
  color?: 'info' | 'warning' | 'success' | 'danger';
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
 * <Alert color='info'>Dette er en informasjonsmelding</Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { color = 'info', size = 'md', className, ...rest },
  ref,
) {
  return (
    <Paragraph asChild size={size}>
      <div
        className={cl('ds-alert', className)}
        data-color={color}
        data-size={size}
        ref={ref}
        {...rest}
      />
    </Paragraph>
  );
});
