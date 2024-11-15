import type { Placement } from '@floating-ui/utils';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import type { Color } from '../../colors';
import type { DefaultProps } from '../../types';
import type { Merge } from '../../utilities';
import { Popover } from '../Popover';

export type HelpTextProps = Merge<
  DefaultProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
  {
    /** Specify which color palette to use. If left unspecified, the color is inherited from the nearest ancestor with data-color.
     */
    'data-color'?: Color;
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
          {...rest}
        />
        <Popover placement={placement} data-color='info'>
          {children}
        </Popover>
      </Popover.TriggerContext>
    );
  },
);
