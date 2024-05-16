import type { ButtonHTMLAttributes } from 'react';
import { useState } from 'react';
import cl from 'clsx';
import type { Placement } from '@floating-ui/utils';

import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover/Popover';
import type { PortalProps } from '../../types/Portal';

import { HelpTextIcon } from './HelpTextIcon';

export type HelpTextProps = {
  /**
   * Title for screen readers.
   **/
  title: string;
  /**
   * Size of the icon.
   * @default medium
   */
  size?: PopoverProps['size'];
  /**
   * Placement of the Popover.
   * @default 'right'
   */
  placement?: Placement;
} & PortalProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

const HelpText = ({
  title,
  placement = 'right',
  size = 'md',
  portal,
  className,
  children,
  ...rest
}: HelpTextProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover
        variant='info'
        placement={placement}
        size={size}
        portal={portal}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Popover.Trigger
          asChild
          variant='tertiary'
        >
          <button
            className={cl(
              `fds-helptext--${size}`,
              'fds-helptext__button',
              `fds-focus`,
              className,
            )}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            {...rest}
          >
            <HelpTextIcon
              filled
              className={cl(
                `fds-helptext__icon`,
                `fds-helptext__icon--filled`,
                className,
              )}
              openState={open}
            />
            <HelpTextIcon
              className={cl(`fds-helptext__icon`, className)}
              openState={open}
            />
            <span className={`fds-sr-only`}>{title}</span>
          </button>
        </Popover.Trigger>
        <Popover.Content className='fds-helptext__content'>
          {children}
        </Popover.Content>
      </Popover>
    </>
  );
};

HelpText.displayName = 'HelpText';

export { HelpText };
