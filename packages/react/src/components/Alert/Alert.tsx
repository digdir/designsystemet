import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { SeverityColors } from '../../colors';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type AlertProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Sets color and icon.
     *
     * @default 'info'
     */
    'data-color'?: SeverityColors;
  }
>;

/**
 * Alerts are used to inform users about important information, warnings, errors, or success.
 *
 * @example
 * <Alert data-color='info'>Dette er en informasjonsmelding</Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { 'data-color': color = 'info', className, ...rest },
  ref,
) {
  return (
    <div
      className={cl('ds-alert', className)}
      data-color={color}
      ref={ref}
      {...rest}
    />
  );
});
