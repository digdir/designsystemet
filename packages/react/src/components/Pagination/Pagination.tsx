import { forwardRef } from 'react';
import * as React from 'react';
import cn from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@digdir/design-system-react';

import classes from './Pagination.module.css';

export interface PaginationProps {
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
}

// eslint-disable-next-line react/display-name
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      nextLabel = '',
      previousLabel = '',
      size = 'medium',
      variant = 'normal',
      currentPage = 1,
      totalPages,
      onChange,
    }: PaginationProps,
    ref,
  ) => {
    const previousEllipsis = () => {
      return (
        ((currentPage > 2 && variant === 'compact' && totalPages > 5) ||
          (currentPage > 2 && variant === 'normal' && totalPages > 8)) && (
          <li>
            <p>...</p>
          </li>
        )
      );
    };
    const nextEllipsis = () => {
      return (
        currentPage < totalPages - 2 &&
        totalPages > 5 && (
          <li>
            <p>...</p>
          </li>
        )
      );
    };

    const centerPages = () => {
      let pages: number[];

      if (currentPage === 2) {
        pages = Array.from({ length: 4 }, (_, index) => currentPage + index);
      } else if (currentPage < totalPages - 2 && currentPage !== 1) {
        pages = Array.from({ length: 2 }, (_, index) => currentPage + index);
      } else if (currentPage === 1) {
        pages = Array.from(
          { length: 4 },
          (_, index) => currentPage + 1 + index,
        );
      } else {
        pages = Array.from({ length: 3 }, (_, index) => totalPages - 3 + index);
      }

      if (variant === 'compact') {
        if (totalPages > 5) {
          if (currentPage === 2) {
            pages = Array.from(
              { length: 2 },
              (_, index) => currentPage + index,
            );
          } else if (
            currentPage === totalPages - 2 ||
            currentPage >= totalPages - 1
          ) {
            pages = Array.from(
              { length: 2 },
              (_, index) => totalPages - 2 + index,
            );
          } else if (currentPage !== 1 && currentPage !== totalPages) {
            pages = Array.from(
              { length: 1 },
              (_, index) => currentPage + index,
            );
          } else if (currentPage === 1) {
            pages = Array.from(
              { length: 2 },
              (_, index) => currentPage + 1 + index,
            );
          } else {
            pages = Array.from(
              { length: 1 },
              (_, index) => totalPages - 3 + index,
            );
          }
        } else {
          if (currentPage === 1) {
            pages = Array.from(
              { length: 3 },
              (_, index) => currentPage + 1 + index,
            );
          } else if (currentPage === 2) {
            pages = Array.from(
              { length: 3 },
              (_, index) => currentPage + index,
            );
          } else {
            pages = Array.from(
              { length: 3 },
              (_, index) => currentPage + index,
            );
          }
        }
      }

      return (
        <>
          {currentPage > 2 && variant === 'normal' && (
            <Button
              variant={'quiet'}
              color={'primary'}
              size={'small'}
              aria-label={`Go to page ${pages[0] - 1}`}
              onClick={() => {
                onChange(pages[0] - 1);
              }}
            >
              {pages[0] - 1}
            </Button>
          )}
          {pages.map((i) => (
            <li key={i}>
              <Button
                variant={currentPage === i ? 'filled' : 'quiet'}
                color={'primary'}
                size={'small'}
                aria-label={`Go to page ${i}`}
                onClick={() => {
                  onChange(i);
                }}
              >
                {i}
              </Button>
            </li>
          ))}
        </>
      );
    };

    return (
      <nav ref={ref}>
        <ul className={classes.pagination}>
          {currentPage !== 1 && (
            <li>
              <Button
                icon={<ChevronLeftIcon />}
                aria-label='Go to previous page'
                onClick={() => {
                  onChange(currentPage - 1);
                }}
                variant={'quiet'}
                color={'primary'}
                size={'small'}
              >
                {previousLabel}
              </Button>
            </li>
          )}
          <Button
            variant={currentPage === 1 ? 'filled' : 'quiet'}
            color={'primary'}
            size={'small'}
            onClick={() => {
              onChange(1);
            }}
          >
            {1}
          </Button>
          {previousEllipsis()}
          {centerPages()}
          {nextEllipsis()}
          <Button
            variant={currentPage === totalPages ? 'filled' : 'quiet'}
            color={'primary'}
            size={'small'}
            onClick={() => {
              onChange(totalPages);
            }}
          >
            {totalPages}
          </Button>
          {currentPage !== totalPages && (
            <li>
              <Button
                variant={'quiet'}
                color={'primary'}
                size={'small'}
                icon={<ChevronRightIcon />}
                aria-label='Go to next page'
                onClick={() => {
                  onChange(currentPage + 1);
                }}
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
