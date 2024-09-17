import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type ModalFooterProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter({ asChild, className, ...rest }, ref) {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        className={cl('ds-modal__footer', className)}
        ref={ref}
        {...rest}
      />
    );
  },
);
