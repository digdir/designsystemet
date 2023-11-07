import type { HTMLAttributes } from 'react';
import React from 'react';
import cn from 'classnames';

import { Divider } from '../../Divider';

import classes from './ModalFooter.module.css';

type ModalFooterProps = {
  divider?: boolean;
};

export const ModalFooter = ({
  divider = false,
  children,
  ...props
}: ModalFooterProps & HTMLAttributes<HTMLElement>) => {
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
};

ModalFooter.displayName = 'Modal.Footer';
