import type { Placement } from '@floating-ui/utils';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { Popover, type PopoverProps } from '../Popover';

export type HelpTextProps = {
  /**
   * Required descriptive label for screen readers.
   **/
  'aria-label': string;
  /**
   * Size of the helptext
   * @default md
   */
  size?: PopoverProps['size'];
  /**
   * Placement of the Popover.
   * @default 'right'
   */
  placement?: Placement;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>;

export const HelpText = forwardRef<HTMLButtonElement, HelpTextProps>(
  function HelpText(
    { placement = 'right', size = 'md', className, children, ...rest },
    ref,
  ) {
    return (
      <Popover.Context>
        <Popover.Trigger
          className={cl('ds-helptext', className)}
          ref={ref}
          size={size}
          variant='tertiary'
          {...rest}
        />
        <Popover placement={placement} size={size} variant='info'>
          {children}
        </Popover>
      </Popover.Context>
    );
  },
);
