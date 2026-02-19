import { forwardRef, type HTMLAttributes } from 'react';

export type BreadcrumbsListProps = HTMLAttributes<HTMLOListElement>;

export const BreadcrumbsList = forwardRef<
  HTMLOListElement,
  BreadcrumbsListProps
>(function BreadcrumbsList(rest, ref) {
  return <ol ref={ref} {...rest} />;
});
