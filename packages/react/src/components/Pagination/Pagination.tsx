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
  /** Sets the current page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Function to be called when the selected page changes. */
  onChange: (currentPage: number) => void;
  /** `aria-label` for pagination item */
  itemLabel?: (currentPage: number) => string;
} & Omit<React.HTMLAttributes<HTMLElement>, 'onChange'>;

export const getSteps = (
  props: Pick<PaginationProps, 'compact' | 'currentPage' | 'totalPages'>,
): ('ellipsis' | number)[] => {
  /**  Number of always visible pages at the start and end. */
  const boundaryCount = 1;

  /** Number of always visible pages before and after the current page. */
  const siblingCount = props.compact ? 0 : 1;

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  if (props.totalPages <= (boundaryCount + siblingCount) * 2 + 3)
    return range(1, props.totalPages);

  const startPages = range(1, boundaryCount);
  const endPages = range(
    props.totalPages - boundaryCount + 1,
    props.totalPages,
  );

  const siblingsStart = Math.max(
    Math.min(
      props.currentPage - siblingCount,
      props.totalPages - boundaryCount - siblingCount * 2 - 1,
    ),
    boundaryCount + 2,
  );
  const siblingsEnd = siblingsStart + siblingCount * 2;

  return [
    ...startPages,
    siblingsStart - (startPages[startPages.length - 1] ?? 0) === 2
      ? siblingsStart - 1
      : 'ellipsis',
    ...range(siblingsStart, siblingsEnd),
    (endPages[0] ?? props.totalPages + 1) - siblingsEnd === 2
      ? siblingsEnd + 1
      : 'ellipsis',
    ...endPages,
  ];
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
          {getSteps({ compact, currentPage, totalPages }).map((step, i) => (
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
