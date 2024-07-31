import type { Placement } from '@floating-ui/utils';
import cl from 'clsx/lite';
import type { ButtonHTMLAttributes } from 'react';
import { useState } from 'react';

import type { PortalProps } from '../../types/Portal';
import { Popover } from '../Popover';
import type { PopoverRootProps } from '../Popover/PopoverRoot';
import { Paragraph } from '../Typography/Paragraph';

import { HelpTextIcon } from './HelpTextIcon';

export type HelpTextProps = {
  /**
   * Title for screen readers.
   **/
  title: string;
  /**
   * Size of the helptext
   * @default md
   */
  size?: PopoverRootProps['size'];
  /**
   * Placement of the Popover.
   * @default 'right'
   */
  placement?: Placement;
} & PortalProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const HelpText = ({
  title,
  placement = 'right',
  portal,
  size = 'md',
  className,
  children,
  ...rest
}: HelpTextProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover.Root
        variant='info'
        placement={placement}
        size={size}
        portal={portal}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Popover.Trigger asChild variant='tertiary'>
          <button
            className={cl(
              `ds-helptext--${size}`,
              'ds-helptext__button',
              `ds-focus`,
              className,
            )}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            {...rest}
          >
            <HelpTextIcon
              filled
              className={cl(
                `ds-helptext__icon`,
                `ds-helptext__icon--filled`,
                className,
              )}
              openState={open}
            />
            <HelpTextIcon
              className={cl(`ds-helptext__icon`, className)}
              openState={open}
            />
            <span className={`ds-sr-only`}>{title}</span>
          </button>
        </Popover.Trigger>
        <Paragraph size='md' asChild>
          <Popover.Content className='ds-helptext__content'>
            {children}
          </Popover.Content>
        </Paragraph>
      </Popover.Root>
    </>
  );
};

HelpText.displayName = 'HelpText';
