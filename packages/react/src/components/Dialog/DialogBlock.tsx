import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type DialogBlockProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

/**
 * DialogBlock component, used to separate content in a Dialog.
 *
 * @example
 * <Dialog>
 *   <Dialog.Block>
 *     Header
 *   </Dialog.Block>
 *   <Dialog.Block>
 *     Content
 *   </Dialog.Block>
 *   <Dialog.Block>
 *     Footer
 *   </Dialog.Block>
 * </Dialog>
 */
export const DialogBlock = forwardRef<HTMLDivElement, DialogBlockProps>(
  function DialogBlock({ asChild, className, ...rest }, ref) {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        className={cl('ds-dialog__block', className)}
        ref={ref}
        {...rest}
      />
    );
  },
);
