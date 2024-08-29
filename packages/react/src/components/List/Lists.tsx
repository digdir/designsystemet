import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { OlHTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { ListContext } from './ListRoot';

export type ListUnorderedProps = Omit<
  React.HTMLAttributes<HTMLUListElement>,
  'size'
>;

export const Unordered = forwardRef<HTMLUListElement, ListUnorderedProps>(
  function ListUnordered({ className, ...rest }, ref) {
    const { size, headingId } = useContext(ListContext);

    return (
      <ul
        aria-labelledby={headingId}
        className={cl(`ds-list`, className)}
        data-ds-size={size}
        ref={ref}
        {...rest}
      />
    );
  },
);

export type ListOrderedProps = Omit<
  React.OlHTMLAttributes<HTMLOListElement>,
  'size'
>;
export const Ordered = forwardRef<HTMLOListElement, ListOrderedProps>(
  function ListOrdered({ className, ...rest }, ref) {
    const { size, headingId } = useContext(ListContext);

    return (
      <ol
        aria-labelledby={headingId}
        className={cl(`ds-list`, className)}
        data-ds-size={size}
        ref={ref}
        {...rest}
      />
    );
  },
);
