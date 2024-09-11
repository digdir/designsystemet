import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';

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
  { asChild, className, size = 'md', ...rest }: ListOrderedProps,
  ref: React.ForwardedRef<HTMLType>,
) => {
  const Component = asChild ? Slot : tagName;

  return (
    <Paragraph size={size} asChild>
      <Component
        className={cl(`ds-list`, className)}
        data-size={size}
        ref={ref}
        {...rest}
      />
    </Paragraph>
  );
};

export const ListUnordered = forwardRef<HTMLUListElement, ListUnorderedProps>(
  function ListUnordered(props, ref) {
    return render<HTMLUListElement>('ul', props, ref);
  },
);

export const ListOrdered = forwardRef<HTMLOListElement, ListOrderedProps>(
  function ListOrdered(props, ref) {
    return render<HTMLOListElement>('ol', props, ref);
  },
);
