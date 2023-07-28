import { forwardRef } from 'react';
import * as React from 'react';
import cn from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import { Button } from '../Button';

import classes from './Pagination.module.css';

export type PaginationProps = {
  /** Sets the text label for the next page button
   * @default ''
   */
  nextLabel: string;
  /** Sets the text label for the previous page button
   * @default ''
   */
  previousLabel: string;
  /** Sets the size of the component
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /** Sets how compact the component will be. If true, only 5 steps will show.
   * @default false
   */
  compact?: boolean;
  /** Hides the component's previous and next button labels
   * @default false
   */
  hideLabels?: boolean;
  /** Sets the current page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Function to be called when the selected page changes. */
  onChange: (currentPage: number) => void;
} & React.HTMLAttributes<HTMLElement>;

// eslint-disable-next-line react/display-name
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      nextLabel = '',
      previousLabel = '',
      size = 'small',
      compact = false,
      hideLabels = false,
      currentPage = 1,
      totalPages,
      onChange,
      ...rest
    }: PaginationProps,
    ref,
  ) => {
    const getSteps = () => {
      /**  Number of always visible pages at the start and end. */
      const boundaryCount = 1;

      /** Number of always visible pages before and after the current page. */
      const siblingCount = compact ? 0 : 1;

      const range = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i);

      if (totalPages <= (boundaryCount + siblingCount) * 2 + 3)
        return range(1, totalPages);

      const startPages = range(1, boundaryCount);
      const endPages = range(totalPages - boundaryCount + 1, totalPages);

      const siblingsStart = Math.max(
        Math.min(
          currentPage - siblingCount,
          totalPages - boundaryCount - siblingCount * 2 - 1,
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
        (endPages[0] ?? totalPages + 1) - siblingsEnd === 2
          ? siblingsEnd + 1
          : 'ellipsis',
        ...endPages,
      ];
    };

    return (
      <nav
        ref={ref}
        {...rest}
      >
        <ul className={classes.pagination}>
          {currentPage !== 1 ? (
            <li className={cn(classes.chevronLeft, classes[size])}>
              <Button
                icon={<ChevronLeftIcon />}
                aria-label={previousLabel}
                onClick={() => {
                  onChange(currentPage - 1);
                }}
                variant={'quiet'}
                color={'primary'}
                size={size}
              >
                {!hideLabels && previousLabel}
              </Button>
            </li>
          ) : (
            <div className={cn(classes.whitespace)}></div>
          )}
          {getSteps().map((step) => {
            const n = Number(step);
            return String(step) === 'ellipsis' ? (
              <li
                className={cn(classes.listitem, classes[size])}
                key={`${step}`}
              >
                <p className={cn(classes.ellipsis)}>...</p>
              </li>
            ) : (
              <li
                className={cn(classes.listitem, classes[size])}
                key={step}
              >
                <Button
                  variant={currentPage === n ? 'filled' : 'quiet'}
                  aria-current={currentPage === n}
                  color={'primary'}
                  size={size}
                  aria-label={`Page ${n}`}
                  onClick={() => {
                    onChange(n);
                  }}
                  fullWidth
                >
                  {n}
                </Button>
              </li>
            );
          })}
          {currentPage !== totalPages ? (
            <li className={cn(classes.chevronRight, classes[size])}>
              <Button
                variant={'quiet'}
                color={'primary'}
                size={size}
                icon={<ChevronRightIcon />}
                aria-label={nextLabel}
                onClick={() => {
                  onChange(currentPage + 1);
                }}
                iconPlacement='right'
              >
                {!hideLabels && nextLabel}
              </Button>
            </li>
          ) : (
            <div className={cn(classes.whitespace)}></div>
          )}
        </ul>
      </nav>
    );
  },
);
