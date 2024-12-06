import type { Placement } from '@floating-ui/utils';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Popover } from '../Popover';

export type HelpTextProps = MergeRight<
  DefaultProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
  {
    /**
     * Required descriptive label for screen readers.
     **/
    'aria-label': string;
    /**
     * Placement of the Popover.
     * @default 'right'
     */
    placement?: Placement;
  }
>;

export const HelpText = forwardRef<HTMLButtonElement, HelpTextProps>(
  function HelpText(
    { placement = 'right', className, children, ...rest },
    ref,
  ) {
    return (
      <Popover.TriggerContext>
        <Popover.Trigger
          className={cl('ds-helptext', className)}
          ref={ref}
          variant='tertiary'
          data-color='info'
          {...rest}
        />
        <Popover placement={placement} data-color='info'>
          {children}
        </Popover>
      </Popover.TriggerContext>
    );
  },
);
