import { useMemo } from 'react';
import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { PaginationButtonProps } from './PaginationButton';

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
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  onChange?: (event: MouseEvent<HTMLElement>, page: number) => void;
  totalPages: number;
  showPages?: number;
};

/** Hook to help manage pagination state */
export const usePagination = ({
  currentPage = 1,
  setCurrentPage,
  onChange,
  totalPages,
  showPages = 7,
}: UsePaginationProps) =>
  useMemo(() => {
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage !== 1;
    const handleClick = (page: number) => (event: MouseEvent<HTMLElement>) => {
      if (page < 1 || page > totalPages) return event.preventDefault(); // Prevent out of bounds navigation
      onChange?.(event, page);
      if (!event.defaultPrevented) setCurrentPage?.(page); // Allow stopping change by calling event.preventDefault() in onChange
    };

    return {
      /** Number of steps */
      pages: getSteps(currentPage, totalPages, showPages).map(
        (page, index) => ({
          page: page || '',
          itemKey: page ? `page-${page}` : `ellipsis-${index}`, // React key utility
          buttonProps: {
            'aria-current': page === currentPage ? 'page' : undefined,
            'aria-hidden': !page || undefined, // Hide ellipsis from screen reader
            onClick: handleClick(page),
            tabIndex: page ? undefined : -1, // Hide ellipsis keyboard
            variant: page === currentPage ? 'primary' : 'tertiary',
          } as PaginationButtonProps,
        }),
      ),
      /** Properties to spread on Pagination.Button used for previous naviagation */
      prevButtonProps: {
        'aria-disabled': !hasPrev, // Using aria-disabled to support all HTML elements because of potential asChild
        onClick: handleClick(currentPage - 1),
        variant: 'tertiary',
      } as PaginationButtonProps,
      /** Properties to spread on Pagination.Button used for next naviagation */
      nextButtonProps: {
        'aria-disabled': !hasNext, // Using aria-disabled to support all HTML elements because of potential asChild
        onClick: handleClick(currentPage + 1),
        variant: 'tertiary',
      } as PaginationButtonProps,
      /** Indication if previous page action should be shown or not */
      hasPrev,
      /** Indication if next page action should be shown or not */
      hasNext,
    };
  }, [currentPage, totalPages, showPages]);
