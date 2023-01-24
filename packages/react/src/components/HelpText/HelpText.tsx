import type { ButtonHTMLAttributes } from 'react';
import React, { useState } from 'react';
import cn from 'classnames';
import { HelptextFilled, Helptext } from '@navikt/ds-icons';

import { Popover, PopoverVariant } from '../Popover';

import classes from './HelpText.module.css';

export interface HelpTextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  title?: string;
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

export const HelpText = ({
  className,
  children,
  title,
  placement = 'right',
  onClick,
  ...rest
}: HelpTextProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      variant={PopoverVariant.Info}
      placement={placement}
      open={open}
      onOpenChange={setOpen}
      className={cn(classes.helpTextContent)}
      trigger={
        <button
          {...rest}
          className={cn(classes.helpTextButton, className)}
          onClick={(event) => {
            setOpen((isOpen) => !isOpen);
            onClick?.(event);
          }}
          aria-expanded={open}
        >
          <HelptextFilled
            className={cn(
              classes.helpTextIcon,
              classes.helpTextIconFilled,
              className,
            )}
            title={title}
            data-state={open ? 'open' : 'closed'}
          />
          <Helptext
            className={cn(classes.helpTextIcon, className)}
            title={title}
            data-state={open ? 'open' : 'closed'}
          />
        </button>
      }
    >
      {children}
    </Popover>
  );
};
