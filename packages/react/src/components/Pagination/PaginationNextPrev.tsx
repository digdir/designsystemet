import { forwardRef } from 'react';

import type { PaginationButtonProps } from './PaginationButton';
import { PaginationButton } from './PaginationButton';

export type PaginationNextProps = PaginationButtonProps;

export const PaginationNext = forwardRef<HTMLButtonElement, PaginationNextProps>(({ ...rest }, ref) => {
  return (
    <PaginationButton
      ref={ref}
      aria-label={rest.children != null ? undefined : 'Neste side'}
      {...rest}
    />
  );
});

export type PaginationPreviousProps = PaginationButtonProps;

export const PaginationPrevious = forwardRef<HTMLButtonElement, PaginationNextProps>(({ ...rest }, ref) => {
  return (
    <PaginationButton
      ref={ref}
      aria-label={rest.children != null ? undefined : 'Forrige side'}
      {...rest}
    />
  );
});
