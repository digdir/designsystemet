import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export type PaginationProps = {
  /**
   * Sets the screen reader label for the Pagination area
   * @default Sidenavigering
   */
  'aria-label'?: string;
  /** Sets the size of the component
   * @default md
   */
  size?: undefined | 'sm' | 'md' | 'lg';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      'aria-label': ariaLabel = 'Sidenavigering',
      asChild,
      className,
      size,
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'nav';

    return (
      <Component
        aria-label={ariaLabel}
        className={cl('ds-pagination', className)}
        data-size={size}
        ref={ref}
        {...rest}
      />
    );
  },
);
