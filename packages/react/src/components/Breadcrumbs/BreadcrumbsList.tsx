import { inner, useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useEffect, useRef } from 'react';

export type BreadcrumbsListProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLOListElement>, 'size'>;

export const BreadcrumbsList = forwardRef<
  HTMLOListElement,
  BreadcrumbsListProps
>(({ asChild, className, ...rest }, ref) => {
  const Component = asChild ? Slot : 'ol';
  const innerRef = useRef<HTMLOListElement>(null);
  const mergedRefs = useMergeRefs([innerRef, ref]);

  // Set aria-current on last link
  useEffect(() => {
    const links = innerRef.current?.querySelectorAll('a') || [];
    const lastIndex = links?.length - 1;

    links?.forEach((link, index) => {
      if (index === lastIndex) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, [rest.children]);

  return (
    <Component
      ref={mergedRefs}
      className={cl('ds-breadcrumbs__list', className)}
      {...rest}
    />
  );
});

BreadcrumbsList.displayName = 'BreadcrumbsList';
