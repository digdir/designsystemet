import React, { forwardRef, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import { Button } from '..';

import classes from './Pagination.module.css';

export type PaginationProps = {
  /** Sets the text label for the next page button */
  nextLabel?: string;
  /** Sets the text label for the previous page button */
  previousLabel?: string;
  /** Sets the size of the component */
  size?: 'small' | 'medium';
  /** Sets the how compact the component will be */
  variant?: 'normal' | 'compact';
  /** Sets the current page */
  currentPage?: number;
  /** Total number of pages */
  totalPages: number;
  /**
   * Optional function to be called when the selected value changes.
   * @param selectedValue The new selected value.
   * @returns void
   */
  onChange: (currentPage: number) => void;
};

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      nextLabel,
      previousLabel,
      size = 'medium',
      variant = 'normal',
      currentPage = 1,
      totalPages,
      onChange,
    }: PaginationProps,
    ref,
  ) => {
    const showCompactPreviousDots = currentPage > 3 && totalPages > 5;
    const showCompactNextDots = currentPage < totalPages - 3 && totalPages > 5;
    const [page, setPage] = React.useState(currentPage);

    const compactPageButtons = () => {
      const compactPages: number[] = Array.from(
        { length: 5 },
        (_, index) => page + index,
      );

      return (
        variant === 'compact' &&
        compactPages.map((i) => (
          <li key={i}>
            <Button
              variant={page === i ? 'filled' : 'quiet'}
              color={'primary'}
              size={'small'}
              aria-label={`Go to page ${i}`}
              onClick={() => setPage(i)}
            >
              {i}
            </Button>
          </li>
        ))
      );
    };

    return (
      <nav ref={ref}>
        <ul className={classes.pagination}>
          {page != 1 && (
            <li>
              <Button
                icon={<ChevronLeftIcon />}
                aria-label='Go to previous page'
                onClick={() => setPage(page - 1)}
                variant={'quiet'}
                color={'primary'}
                size={'small'}
              >
                {previousLabel}
              </Button>
            </li>
          )}
          {showCompactPreviousDots && (
            <>
              <Button
                variant={'quiet'}
                color={'primary'}
                size={'small'}
              >
                {1}
              </Button>
              <p>...</p>
            </>
          )}
          {compactPageButtons()}
          {showCompactNextDots && (
            <>
              <p>...</p>
              <Button
                variant={'quiet'}
                color={'primary'}
                size={'small'}
              >
                {totalPages}
              </Button>
            </>
          )}
          {page != totalPages && (
            <li>
              <Button
                variant={'quiet'}
                color={'primary'}
                size={'small'}
                icon={<ChevronRightIcon />}
                aria-label='Go to next page'
                onClick={() => setPage(page + 1)}
              >
                {nextLabel}
              </Button>
            </li>
          )}
        </ul>
      </nav>
    );
  },
);
