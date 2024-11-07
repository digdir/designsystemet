import type { Placement } from '@floating-ui/utils';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import type { DefaultProps } from '../../types';
import { Popover } from '../Popover';

export type HelpTextProps = {
  /**
   * Required descriptive label for screen readers.
   **/
  'aria-label': string;
  /**
   * Placement of the Popover.
   * @default 'right'
   */
  placement?: Placement;
} & { 'data-size'?: string } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'color'
  > &
  DefaultProps;

export const HelpText = forwardRef<HTMLButtonElement, HelpTextProps>(
  function HelpText(
    { placement = 'right', className, children, ...rest },
    ref,
  ) {
    return (
      <Popover.Context>
        <Popover.Trigger
          className={cl('ds-helptext', className)}
          ref={ref}
          variant='tertiary'
          {...rest}
        />
        <Popover placement={placement} variant='info'>
          {children}
        </Popover>
      </Popover.Context>
    );
  },
);
