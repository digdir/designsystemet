import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type ModalBlockProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ModalBlock = forwardRef<HTMLDivElement, ModalBlockProps>(
  function ModalBlock({ asChild, className, ...rest }, ref) {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        className={cl('ds-modal__block', className)}
        ref={ref}
        {...rest}
      />
    );
  },
);
