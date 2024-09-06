import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef, useEffect, useId, useRef } from 'react';

import { Paragraph } from '../Typography';

type ListBaseProps = {
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
};

export type ListUnorderedProps = ListBaseProps &
  Omit<React.HTMLAttributes<HTMLUListElement>, 'size'>;

export type ListOrderedProps = ListBaseProps &
  Omit<React.OlHTMLAttributes<HTMLOListElement>, 'size'>;

const render = <HTMLType extends HTMLElement>(
  tagName: string,
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    asChild,
    className,
    size = 'md',
    ...rest
  }: ListOrderedProps,
  ref: React.ForwardedRef<HTMLType>,
) => {
  const Component = asChild ? Slot : tagName;
  const randomId = useId();
  const innerRef = useRef<HTMLType>(null);
  const hasLabel = ariaLabel ?? ariaLabelledby ?? false;
  const mergedRefs = useMergeRefs([innerRef, ref]);

  // Connect previous heading element if available. This does not affect visuall rendering,
  // and is not an accessibility requirement, but its a nice enhancement when heading + list relation is obvious.
  useEffect(() => {
    const list = innerRef.current;
    const heading = list?.previousElementSibling;
    const headingId = heading?.id || randomId;

    if (hasLabel === false && heading?.matches('h1,h2,h3,h4,h5,h6')) {
      list?.setAttribute('aria-labelledby', headingId);
      heading.id = headingId;
    }
    return () => list?.removeAttribute('aria-labelledby');
  }, [hasLabel]);

  return (
    <Paragraph size={size} asChild>
      <Component
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cl(`ds-list`, className)}
        data-size={size}
        ref={mergedRefs}
        {...rest}
      />
    </Paragraph>
  );
};

export const ListUnordered = forwardRef<HTMLUListElement, ListOrderedProps>(
  function ListUnordered(props, ref) {
    return render<HTMLUListElement>('ul', props, ref);
  },
);

export const ListOrdered = forwardRef<HTMLOListElement, ListOrderedProps>(
  function ListOrdered(props, ref) {
    return render<HTMLOListElement>('ol', props, ref);
  },
);
