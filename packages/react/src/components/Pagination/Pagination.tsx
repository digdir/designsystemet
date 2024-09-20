import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { createContext, forwardRef, useState } from 'react';
import type { Dispatch, HTMLAttributes, SetStateAction } from 'react';

export const PaginationContext = createContext({
  size: 'md' as NonNullable<PaginationProps['size']>,
});

export type PaginationProps = {
  /**
   * Sets the screen reader label for the Pagination area
   * @default 'Sidenavigering'
   */
  'aria-label'?: string;
  /** Sets the size of the component
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
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
      className,
      asChild,
      size = 'md',
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'nav';

    return (
      <PaginationContext.Provider value={{ size }}>
        <Component
          aria-label={ariaLabel}
          className={cl('ds-pagination', className)}
          ref={ref}
          {...rest}
        />
      </PaginationContext.Provider>
    );
  },
);
