import type { Placement } from '@floating-ui/utils';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import type { Size } from '../../types';
import { Popover } from '../Popover';

export type HelpTextProps = {
  /**
   * Required descriptive label for screen readers.
   **/
  'aria-label': string;
  /**
   * Size of the helptext
   */
  size?: Size;
  /**
   * Placement of the Popover.
   * @default 'right'
   */
  placement?: Placement;
} & { 'data-size'?: string } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'color'
  >;

export const HelpText = forwardRef<HTMLButtonElement, HelpTextProps>(
  function HelpText(
    { placement = 'right', size, className, children, ...rest },
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
        <Popover
          placement={placement}
          size={size || (rest['data-size'] as Size)}
          variant='info'
        >
          {children}
        </Popover>
      </Popover.Context>
    );
  },
);
