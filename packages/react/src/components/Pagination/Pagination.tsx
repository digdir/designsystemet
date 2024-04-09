import { forwardRef } from 'react';
import type * as React from 'react';
import cl from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import { PaginationRoot } from './PaginationRoot';
import { PaginationContent } from './PaginationContent';
import { PaginationItem } from './PaginationItem';
import { PaginationButton } from './PaginationButton';
import { PaginationEllipsis } from './PaginationEllipsis';
import classes from './Pagination.module.css';
import { PaginationNext, PaginationPrevious } from './PaginationNextPrev';
import { usePagination } from './usePagination';

export type PaginationProps = {
  /** Sets the text label for the next page button */
  nextLabel: string;
  /** Sets the text label for the previous page button */
  previousLabel: string;
  /** Sets the size of the component */
  size?: 'small' | 'medium' | 'large';
  /** Sets how compact the component will be. If true, only 5 steps will show. */
  compact?: boolean;
  /** Hides the component's previous and next button labels */
  hideLabels?: boolean;
  /** Sets the current page
   * @default 1
   */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Function to be called when the selected page changes. */
  onChange: (currentPage: number) => void;
  /** `aria-label` for pagination item */
  itemLabel?: (currentPage: number) => string;
} & Omit<React.HTMLAttributes<HTMLElement>, 'onChange'>;

const iconSize = {
  small: '1rem',
  medium: '1.5rem',
  large: '2rem',
};

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      nextLabel = '',
      previousLabel = '',
      size = 'medium',
      compact = false,
      hideLabels = false,
      currentPage = 1,
      totalPages,
      onChange,
      itemLabel = (num) => `Side ${num}`,
      ...rest
    }: PaginationProps,
    ref,
  ) => {
    const { pages, showNextPage, showPreviousPage } = usePagination({
      compact,
      currentPage,
      totalPages,
    });
    return (
      <PaginationRoot
        ref={ref}
        aria-label='Pagination'
        size={size}
        compact={compact}
        {...rest}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cl({ [classes.hidden]: !showPreviousPage })}
              onClick={() => {
                onChange(currentPage - 1);
              }}
              aria-label={previousLabel}
            >
              <ChevronLeftIcon
                aria-hidden
                fontSize={iconSize[size]}
              />
              {!hideLabels && previousLabel}
            </PaginationPrevious>
          </PaginationItem>
          {pages.map((page, i) => (
            <PaginationItem key={`${page}${i}`}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationButton
                  aria-current={currentPage === page}
                  isActive={currentPage === page}
                  aria-label={itemLabel(page)}
                  onClick={() => {
                    onChange(page);
                  }}
                >
                  {page}
                </PaginationButton>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              aria-label={nextLabel}
              onClick={() => {
                onChange(currentPage + 1);
              }}
              className={cl({
                [classes.hidden]: !showNextPage,
              })}
            >
              {!hideLabels && nextLabel}
              <ChevronRightIcon
                aria-hidden
                fontSize={iconSize[size]}
              />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>
    );
  },
);

Pagination.displayName = 'Pagination';
