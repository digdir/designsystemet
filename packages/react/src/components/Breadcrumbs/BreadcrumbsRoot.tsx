import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

import { Paragraph } from '../Typography';

export type BreadcrumbsRootProps = {
  /**
   * Sets the size of the component
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const BreadcrumbsRoot = forwardRef<HTMLDivElement, BreadcrumbsRootProps>(
  ({ asChild, className, size = 'md', ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        className={cl('ds-breadcrumbs', `ds-breadcrumbs--${size}`, className)}
        {...rest}
      />
    );
  },
);

BreadcrumbsRoot.displayName = 'BreadcrumbsRoot';
