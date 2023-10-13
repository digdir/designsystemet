import type { ButtonHTMLAttributes } from 'react';
import React, { useRef, useState } from 'react';
import cn from 'classnames';
import type { Placement } from '@floating-ui/utils';

import { Popover } from '../Popover';
import utilClasses from '../../utils/utility.module.css';

import classes from './HelpText.module.css';
import { HelpTextIcon } from './HelpTextIcon';

export interface HelpTextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  title: string;
  size?: 'small' | 'xsmall';
  placement?: Placement;
}

const HelpText = ({
  className,
  children,
  title,
  placement = 'right',
  onClick,
  size = 'small',
  ...rest
}: HelpTextProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        className={cn(classes.helpTextButton, className)}
        onClick={(event) => {
          setOpen((isOpen) => !isOpen);
          onClick?.(event);
        }}
      >
        <HelpTextIcon
          filled
          className={cn(
            classes.helpTextIcon,
            classes.helpTextIconFilled,
            classes[size],
            className,
          )}
          openState={open}
        />
        <HelpTextIcon
          className={cn(classes.helpTextIcon, classes[size], className)}
          openState={open}
        />
        <span className={utilClasses.visuallyHidden}>{title}</span>
      </button>
      <Popover
        variant='info'
        anchorEl={buttonRef.current}
        placement={placement}
        open={open}
        onClose={() => setOpen(false)}
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
