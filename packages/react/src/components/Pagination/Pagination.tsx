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
    const { steps } = usePagination({ compact, currentPage, totalPages });
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
              className={cl({ [classes.hidden]: currentPage === 1 })}
              onClick={() => {
                onChange(currentPage - 1);
              }}
              aria-label={previousLabel}
            >
              <ChevronLeftIcon aria-hidden />
              {!hideLabels && previousLabel}
            </PaginationPrevious>
          </PaginationItem>
          {steps.map((step, i) => (
            <PaginationItem key={`${step}${i}`}>
              {step === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationButton
                  aria-current={currentPage === step}
                  isActive={currentPage === step}
                  aria-label={itemLabel(step)}
                  onClick={() => {
                    onChange(step);
                  }}
                >
                  {step}
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
                [classes.hidden]: currentPage === totalPages,
              })}
            >
              {!hideLabels && nextLabel}
              <ChevronRightIcon aria-hidden />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>
    );
  },
);

Pagination.displayName = 'Pagination';
