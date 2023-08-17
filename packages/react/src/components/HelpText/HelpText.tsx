import type { ButtonHTMLAttributes } from 'react';
import React, { useState } from 'react';
import cn from 'classnames';

import { Popover } from '../Popover';
import utilClasses from '../../utils/utility.module.css';

import classes from './HelpText.module.css';
import { HelpTextIcon } from './HelpTextIcon';

export interface HelpTextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  title: string;
  size?: 'small' | 'xsmall';
  placement?:
    | 'top'
    | 'bottom'
    | 'right'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end';
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
  return (
    <Popover
      variant='info'
      placement={placement}
      open={open}
      onOpenChange={setOpen}
      className={classes.helpTextContent}
      role={'tooltip'}
      trigger={
        <button
          {...rest}
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
      }
    >
      {children}
    </Popover>
  );
};

HelpText.displayName = 'HelpText';

export { HelpText };
