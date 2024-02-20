import { useState } from 'react';

import { type PaginationProps } from './Pagination';

type getStepsProps = Pick<
  PaginationProps,
  'compact' | 'currentPage' | 'totalPages'
>;

const getSteps = (props: getStepsProps): ('ellipsis' | number)[] => {
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

type usePaginationProps = getStepsProps;

export const usePagination = ({
  totalPages,
  currentPage: currentPageProps = 1,
  compact,
}: usePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(currentPageProps);

  const steps = getSteps({ currentPage, totalPages, compact });

  const handleNextPage = () => {
    setCurrentPage(
      currentPage + 1 <= totalPages ? currentPage + 1 : totalPages,
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1 > 0 ? currentPage - 1 : 1);
  };

  return {
    steps,
    currentPage,
    setCurrentPage,
    handlePreviousPage,
    handleNextPage,
    totalPages,
  };
};
