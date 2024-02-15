import { forwardRef } from 'react';

import type { PaginationLinkProps } from './PaginationButton';
import { PaginationLink } from './PaginationButton';

export type PaginationNextProps = PaginationLinkProps;

export const PaginationNext = forwardRef<
  HTMLButtonElement,
  PaginationNextProps
>(({ ...rest }, ref) => {
  return (
    <PaginationLink
      ref={ref}
      aria-label='Neste side'
      {...rest}
    />
  );
});

export type PaginationPreviousProps = PaginationLinkProps;

export const PaginationPrevious = forwardRef<
  HTMLButtonElement,
  PaginationNextProps
>(({ ...rest }, ref) => {
  return (
    <PaginationLink
      ref={ref}
      aria-label='Forrige side'
      {...rest}
    />
  );
});
