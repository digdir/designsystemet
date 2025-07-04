import { forwardRef, type HTMLAttributes } from 'react';

export type BreadcrumbsItemProps = HTMLAttributes<HTMLLIElement>;

export const BreadcrumbsItem = forwardRef<HTMLLIElement, BreadcrumbsItemProps>(
  function BreadcrumbsItem({ className, ...rest }, ref) {
    return <li ref={ref} {...rest} />;
  },
);
