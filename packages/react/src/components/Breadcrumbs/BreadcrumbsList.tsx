import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useEffect, useRef } from 'react';

export type BreadcrumbsListProps = HTMLAttributes<HTMLOListElement>;

export const BreadcrumbsList = forwardRef<
  HTMLOListElement,
  BreadcrumbsListProps
>(({ className, ...rest }, ref) => {
  const innerRef = useRef<HTMLOListElement>(null);
  const mergedRefs = useMergeRefs([innerRef, ref]);

  // Set aria-current on last link
  useEffect(() => {
    const links = innerRef.current?.querySelectorAll('a') || [];
    const lastLink = links[links?.length - 1];

    lastLink?.setAttribute('aria-current', 'page');
    return () => lastLink?.removeAttribute('aria-current'); // Remove on re-render as React can re-use DOM elements
  });

  return (
    <ol
      className={cl('ds-breadcrumbs__list', className)}
      ref={mergedRefs}
      {...rest}
    />
  );
});

BreadcrumbsList.displayName = 'BreadcrumbsList';
