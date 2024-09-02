import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef, useEffect, useId, useRef } from 'react';

import { Paragraph } from '../Typography';

export type ListProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /**
   * Changes text sizing
   * @default md
   *
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Changes type of list style
   * @default unordered
   *
   */
  variant?: 'unordered' | 'ordered' | 'none';
} & (
  | ({ variant: 'ordered' } & Omit<
      React.OlHTMLAttributes<HTMLOListElement>,
      'size'
    >)
  | ({ variant?: 'unordered' | 'none' } & Omit<
      React.HTMLAttributes<HTMLUListElement>,
      'size'
    >)
);

export const List = forwardRef<HTMLOListElement, ListProps>(function List(
  { asChild, className, size = 'md', variant = 'unordered', ...rest },
  ref,
) {
  const Component = asChild ? Slot : variant === 'ordered' ? 'ol' : 'ul';
  const randomId = useId();
  const innerRef = useRef<HTMLOListElement>(null);
  const mergedRefs = useMergeRefs([innerRef, ref]);

  // Connect previous heading element if available. This does not affect visuall rendering,
  // and is not an accessibility requirement, but its a nice enhancement when heading + list relation is obvious.
  useEffect(() => {
    const list = innerRef.current;
    const heading = list?.previousElementSibling;
    const headingId = heading?.id || randomId;

    if (!list?.ariaLabel && heading?.matches('h1,h2,h3,h4,h5,h6')) {
      list?.setAttribute('aria-labelledby', headingId);
      heading.id = headingId;
    }
    return () => list?.removeAttribute('aria-labelledby');
  }, []);

  return (
    <Paragraph size={size} asChild>
      <Component
        className={cl(`ds-list`, className)}
        data-ds-size={size}
        data-ds-variant={variant}
        ref={mergedRefs}
        {...rest}
      />
    </Paragraph>
  );
});
