import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Divider } from '../../Divider';

import classes from './ModalFooter.module.css';

type ModalFooterProps = {
  divider?: boolean;
} & HTMLAttributes<HTMLElement>;

export const ModalFooter = forwardRef<HTMLElement, ModalFooterProps>(
  ({ children, divider = false, ...props }, ref) => {
    return (
      <>
        {divider && (
          <Divider
            color='default'
            style={{ margin: 0 }}
          />
        )}
        <footer
          {...props}
          ref={ref}
          className={cn(
            classes.modalFooter,
            props.className,
            divider && classes.hasDivider,
          )}
        >
          {children}
        </footer>
      </>
    );
  },
);
