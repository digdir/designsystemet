import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

export type ModalContentProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        className={cl('fds-modal__content', className)}
        {...rest}
      />
    );
  },
);

ModalContent.displayName = 'ModalContent';
