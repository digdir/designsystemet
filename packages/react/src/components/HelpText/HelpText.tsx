import type { ButtonHTMLAttributes } from 'react';
import React, { useRef, useState } from 'react';
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
  className,
  children,
  title,
  placement = 'right',
  onClick,
  size = 'medium',
  portal,
  ...rest
}: HelpTextProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        className={cl(classes.helpTextButton, utilClasses.focusable, className)}
        aria-expanded={open}
        onClick={(event) => {
          setOpen((isOpen) => !isOpen);
          onClick?.(event);
        }}
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
          openState={open}
        />
        <HelpTextIcon
          className={cl(classes.helpTextIcon, classes[size], className)}
          openState={open}
        />
        <span className={utilClasses.visuallyHidden}>{title}</span>
      </button>
      <Popover
        variant='info'
        anchorEl={buttonRef.current}
        placement={placement}
        open={open}
        size={size}
        onClose={() => setOpen(false)}
        portal={portal}
      >
        <Popover.Content className={classes.helpTextContent}>
          {children}
        </Popover.Content>
      </Popover>
    </>
  );
};

HelpText.displayName = 'HelpText';

export { HelpText };
