import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import classes from './ModalFooter.module.css';

export type ModalFooterProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

export const ModalFooter = forwardRef<HTMLElement, ModalFooterProps>(({ asChild, className, ...rest }, ref) => {
  const Component = asChild ? Slot : 'footer';

  return (
    <Component
      ref={ref}
      className={cl(classes.modalFooter, className)}
      {...rest}
    />
  );
});

ModalFooter.displayName = 'ModalFooter';
