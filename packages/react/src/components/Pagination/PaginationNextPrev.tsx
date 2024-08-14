import { forwardRef } from 'react';

import type { PaginationButtonProps } from './PaginationButton';
import { PaginationButton } from './PaginationButton';

export type PaginationNextProps = PaginationButtonProps;

const PaginationNext = forwardRef<HTMLButtonElement, PaginationNextProps>(
  ({ ...rest }, ref) => {
    return (
      <PaginationButton
        ref={ref}
        aria-label={rest.children != null ? undefined : 'Neste side'}
        {...rest}
      />
    );
  },
);

PaginationNext.displayName = 'PaginationNext';

export type PaginationPreviousProps = PaginationButtonProps;

const PaginationPrevious = forwardRef<HTMLButtonElement, PaginationNextProps>(
  ({ ...rest }, ref) => {
    return (
      <PaginationButton
        ref={ref}
        aria-label={rest.children != null ? undefined : 'Forrige side'}
        {...rest}
      />
    );
  },
);

PaginationPrevious.displayName = 'PaginationPrevious';

export { PaginationNext, PaginationPrevious };
