import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ForwardedRef, HTMLAttributes, OlHTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';

type ListBaseProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & DefaultProps;

export type ListUnorderedProps = ListBaseProps &
  Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

export type ListOrderedProps = ListBaseProps &
  Omit<OlHTMLAttributes<HTMLOListElement>, 'size'>;

const render = <T extends HTMLElement>(
  tagName: string,
  { asChild, className, ...rest }: ListOrderedProps,
  ref: ForwardedRef<T>,
) => {
  const Component = asChild ? Slot : tagName;

  return <Component className={cl(`ds-list`, className)} ref={ref} {...rest} />;
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
