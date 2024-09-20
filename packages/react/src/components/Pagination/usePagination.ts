import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, MouseEvent, SetStateAction } from 'react';

const getSteps = (now: number, max: number, show: number) => {
  const offset = (show - 1) / 2;
  const start = Math.min(Math.max(now - Math.floor(offset), 1), max - show + 1);
  const end = Math.min(Math.max(now + Math.ceil(offset), show), max);
  const pages = Array.from({ length: end + 1 - start }, (_, i) => i + start);

  if (show > 4 && start > 1) pages.splice(0, 2, 1, 0);
  if (show > 3 && end < max) pages.splice(-2, 2, 0, max);

  return pages;
};

export type UsePaginationProps = {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  showPages?: number;
};

/** Hook to help manage pagination state */
export const usePagination = ({
  currentPage = 1,
  setCurrentPage = () => {},
  totalPages,
  showPages = 7,
}: UsePaginationProps) =>
  useMemo(() => {
    return {
      /** Number of steps */
      pages: getSteps(currentPage, totalPages, showPages).map(
        (page, index) => ({
          page: page || '',
          itemKey: page ? `page-${page}` : `ellipsis-${index}`, // React key utility
          buttonProps: {
            'aria-current':
              page === currentPage ? ('page' as const) : undefined,
            'aria-hidden': !page || undefined, // Hide ellipsis from screen reader
            onClick: page ? () => setCurrentPage(page) : undefined,
            tabIndex: page ? undefined : -1, // Hide ellipsis keyboard
          },
        }),
      ),
      /** Decrements active page by 1 */
      goPrevious: () => setCurrentPage(Math.max(0, currentPage - 1)),
      /** Increments active page by 1 */
      goNext: () => setCurrentPage(Math.min(currentPage + 1, totalPages)),
      /** Total amount of pages */
      totalPages,
      /** Indication if next page action should be shown or not */
      hasNext: currentPage < totalPages,
      /** Indication if previous page action should be shown or not */
      hasPrevious: currentPage !== 1,
    };
  }, [currentPage, totalPages, showPages]);
