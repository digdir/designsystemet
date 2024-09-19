import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, createContext, forwardRef, useRef } from 'react';

type PaginationContextProps = {
  size: NonNullable<PaginationProps['size']>;
  compact: boolean;
};

export const PaginationContext = createContext<PaginationContextProps>({
  size: 'md',
  compact: false,
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
   * Sets how compact the component will be. If true, only 5 steps will show.
   * @default false
   */
  compact?: boolean;
  /** Sets the current page
   * @default 1
   */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Function to be called when the selected page changes. */
  onChange?: (currentPage: number) => void;
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
      compact = false,
      size = 'md',
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'nav';
    const paginationRef = useRef<HTMLElement>(null);
    const mergedRef = useMergeRefs([paginationRef, ref]);

    // TODO: ResizeObserver

    return (
      <PaginationContext.Provider value={{ size, compact }}>
        <Component
          aria-label={ariaLabel}
          className={cl('ds-pagination', className)}
          ref={mergedRef}
          {...rest}
        />
      </PaginationContext.Provider>
    );
  },
);
