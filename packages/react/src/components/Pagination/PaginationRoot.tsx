import { Slot } from '@radix-ui/react-slot';
import { createContext, forwardRef, type HTMLAttributes } from 'react';

import { getSize } from '../../utilities/getSize';

import type { PaginationProps } from './Pagination';

type PaginationContextProps = {
  size: NonNullable<PaginationRootProps['size']>;
  compact: boolean;
};

export const PaginationContext = createContext<PaginationContextProps>({
  size: 'md',
  compact: false,
});

export type PaginationRootProps = {
  /**
   * Sets the size of the component
   * @default md
   * @note `small`, `medium`, `large` is deprecated
   */
  size?: PaginationProps['size'];
  /**
   * Sets how compact the component will be. If true, only 5 steps will show.
   * @default false
   */
  compact?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

export const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(
  ({ asChild, compact = false, ...rest }, ref) => {
    const Component = asChild ? Slot : 'nav';
    const size = getSize(rest.size || 'md') as NonNullable<
      PaginationRootProps['size']
    >;

    return (
      <PaginationContext.Provider value={{ size, compact }}>
        <Component
          ref={ref}
          aria-label='Pagination'
          {...rest}
        />
      </PaginationContext.Provider>
    );
  },
);

export default PaginationRoot;
