import cl from 'clsx/lite';
import type * as React from 'react';
import { forwardRef } from 'react';

export type DividerProps = {
  /**
   * The color of the divider.
   * @default 'default'
   */
  color?: 'default' | 'strong' | 'subtle';
} & React.HTMLAttributes<HTMLHRElement>;

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ color = 'default', className, ...rest }, ref) => {
    return (
      <hr
        className={cl('ds-divider', `ds-divider--${color}`, className)}
        ref={ref}
        {...rest}
      />
    );
  },
);

Divider.displayName = 'Divider';

Divider.displayName = 'Divider';
