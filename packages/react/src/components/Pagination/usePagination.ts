import { useEffect, useState } from 'react';

import type { PaginationProps } from './Pagination';

type GetStepsProps = Pick<
  PaginationProps,
  'compact' | 'currentPage' | 'totalPages'
>;

const getSteps = ({
  compact,
  currentPage,
  totalPages,
}: GetStepsProps): ('ellipsis' | number)[] => {
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

export type UsePaginationProps = Pick<
  PaginationProps,
  'compact' | 'totalPages'
> &
  Partial<Pick<PaginationProps, 'currentPage'>>;

/** Hook to help manage pagination state */
export const usePagination = ({
  totalPages,
  currentPage: currentPageProps = 1,
  compact,
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(currentPageProps);

  useEffect(() => {
    setCurrentPage(currentPageProps);
  }, [currentPageProps]);

  const pages = getSteps({ currentPage, totalPages, compact });

  const showNextPage = currentPage < totalPages;
  const showPreviousPage = currentPage !== 1;

  const nextPage = () => {
    setCurrentPage(
      currentPage + 1 <= totalPages ? currentPage + 1 : totalPages,
    );
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1 > 0 ? currentPage - 1 : 1);
  };

  return {
    /** Number of steps */
    pages,
    /** Current active page  */
    currentPage,
    /** Set active page */
    setCurrentPage,
    /** Decrements active page by 1 */
    previousPage,
    /** Increments active page by 1 */
    nextPage,
    /** Total amount of pages */
    totalPages,
    /** Indication if next page action should be shown or not */
    showNextPage,
    /** Indication if previous page action should be shown or not */
    showPreviousPage,
  };
};
