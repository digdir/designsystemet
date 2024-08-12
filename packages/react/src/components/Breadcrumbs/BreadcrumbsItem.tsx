import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

export type BreadcrumbsItemProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLLIElement>, 'size'>;

export const BreadcrumbsItem = forwardRef<HTMLLIElement, BreadcrumbsItemProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'li';

    return (
      <Component
        ref={ref}
        className={cl('ds-breadcrumbs__item', className)}
        {...rest}
      />
    );
  },
);

BreadcrumbsItem.displayName = 'BreadcrumbsItem';
