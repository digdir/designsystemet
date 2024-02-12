import { Slot } from '@radix-ui/react-slot';
import { createContext, forwardRef, type HTMLAttributes } from 'react';

type PaginationContextProps = {
  size: NonNullable<PaginationRootProps['size']>;
};

export const PaginationContext = createContext<PaginationContextProps>({
  size: 'medium',
});

export type PaginationRootProps = {
  /** Sets the size of the component
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

export const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(
  ({ asChild, size = 'medium', ...rest }, ref) => {
    const Component = asChild ? Slot : 'nav';

    return (
      <PaginationContext.Provider value={{ size }}>
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
