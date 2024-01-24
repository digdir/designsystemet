import { forwardRef } from 'react';
import * as React from 'react';
import cl from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import { Button } from '../Button';
import { Paragraph } from '../Typography';

import classes from './Pagination.module.css';

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
      <nav
        ref={ref}
        aria-label='Pagination'
        {...rest}
      >
        <ul className={cl(classes.pagination, classes[size])}>
          <li>
            <Button
              aria-label={previousLabel}
              onClick={() => {
                onChange(currentPage - 1);
              }}
              icon={hideLabels}
              variant='tertiary'
              color={'first'}
              size={size}
              className={cl({ [classes.hidden]: currentPage === 1 })}
            >
              <ChevronLeftIcon aria-hidden />
              {!hideLabels && previousLabel}
            </Button>
          </li>
          {getSteps({ compact, currentPage, totalPages }).map((step, i) => (
            <li
              className={cl(
                classes.listitem,
                classes[size],
                compact && classes.compact,
              )}
              key={`${step}${i}`}
            >
              {step === 'ellipsis' ? (
                <Paragraph
                  className={cl(classes.ellipsis)}
                  size={size}
                >
                  …
                </Paragraph>
              ) : (
                <Button
                  variant={currentPage === step ? 'primary' : 'tertiary'}
                  aria-current={currentPage === step}
                  color={'first'}
                  size={size}
                  aria-label={itemLabel(step)}
                  onClick={() => {
                    onChange(step);
                  }}
                >
                  {step}
                </Button>
              )}
            </li>
          ))}
          <li>
            <Button
              variant={'tertiary'}
              color={'first'}
              size={size}
              icon={hideLabels}
              aria-label={nextLabel}
              onClick={() => {
                onChange(currentPage + 1);
              }}
              className={cl({
                [classes.hidden]: currentPage === totalPages,
              })}
            >
              <ChevronRightIcon aria-hidden />
              {!hideLabels && nextLabel}
            </Button>
          </li>
        </ul>
      </nav>
    );
  },
);
