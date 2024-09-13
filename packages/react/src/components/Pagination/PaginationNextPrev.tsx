import { forwardRef } from 'react';

import type { PaginationButtonProps } from './PaginationButton';
import { PaginationButton } from './PaginationButton';

export type PaginationNextProps = PaginationButtonProps;

export const PaginationNext = forwardRef<
  HTMLButtonElement,
  PaginationNextProps
>(function PaginationNext({ ...rest }, ref) {
  return (
    <PaginationButton
      aria-label={rest.children != null ? undefined : 'Neste side'}
      ref={ref}
      {...rest}
    />
  );
});

export type PaginationPreviousProps = PaginationButtonProps;

export const PaginationPrevious = forwardRef<
  HTMLButtonElement,
  PaginationNextProps
>(function PaginationPrevious({ ...rest }, ref) {
  return (
    <PaginationButton
      aria-label={rest.children != null ? undefined : 'Forrige side'}
      ref={ref}
      {...rest}
    />
  );
});
