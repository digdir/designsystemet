import type { ButtonHTMLAttributes } from 'react';
import React from 'react';
import cl from 'clsx';
import type { Placement } from '@floating-ui/utils';

import { Popover } from '../Popover';
import utilClasses from '../../utilities/utility.module.css';
import type { PopoverProps } from '../Popover/Popover';
import type { PortalProps } from '../../types/Portal';

import classes from './HelpText.module.css';
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
  size = 'medium',
  portal,
  className,
  children,
  ...rest
}: HelpTextProps) => {
  return (
    <>
      <Popover
        variant='info'
        placement={placement}
        size={size}
        portal={portal}
      >
        <Popover.Trigger asChild>
          <button
            className={cl(
              classes.helpTextButton,
              utilClasses.focusable,
              className,
            )}
            aria-expanded={true}
            {...rest}
          >
            <HelpTextIcon
              filled
              className={cl(
                classes.helpTextIcon,
                classes.helpTextIconFilled,
                classes[size],
                className,
              )}
              openState={true}
            />
            <HelpTextIcon
              className={cl(classes.helpTextIcon, classes[size], className)}
              openState={true}
            />
            <span className={utilClasses.visuallyHidden}>{title}</span>
          </button>
        </Popover.Trigger>
        <Popover.Content className={classes.helpTextContent}>
          {children}
        </Popover.Content>
      </Popover>
    </>
  );
};

HelpText.displayName = 'HelpText';

export { HelpText };
