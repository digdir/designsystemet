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
  title = 'Help',
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
      className={cn(classes['help-text__content'])}
      trigger={
        <button
          {...rest}
          className={cn(classes['help-text__button'], className)}
          onClick={(event) => {
            setOpen((isOpen) => !isOpen);
            onClick?.(event);
          }}
          aria-expanded={open}
        >
          <HelptextFilled
            className={cn(
              classes['help-text__icon'],
              classes['help-text__icon--filled'],
              className,
            )}
            title={title}
            data-state={open ? 'open' : 'closed'}
          />
          <Helptext
            className={cn(classes['help-text__icon'], className)}
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
