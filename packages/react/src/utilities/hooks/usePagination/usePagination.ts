import { useMemo } from 'react';
import type { MouseEvent } from 'react';
import type { PaginationButtonProps } from '../../../components';

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
  /**
   * The current page number
   * @default 1
   */
  currentPage: number;
  /**
   * The total number of pages
   * @default 1
   */
  totalPages: number;
  /**
   * The maximum number of pages to show
   * @default 7
   */
  showPages?: number;
  /**
   * Callback to set the current page
   */
  setCurrentPage?: (page: number) => void;
  /**
   * Callback when the page changes
   */
  onChange?: (event: MouseEvent<HTMLElement>, page: number) => void;
};

/**
 * Hook to help manage pagination state
 *
 * @example
 * const { pages, nextButtonProps, prevButtonProps } = usePagination({
 *   currentPage: page,
 *   totalPages: 10,
 *   showPages: 7,
 *   setCurrentPage,
 * })
 *
 * <Pagination>
 *   <Pagination.Item>
 *     <Pagination.Button {...prevButtonProps}>Forrige</Pagination.Button>
 *   </Pagination.Item>
 *   {pages.map(({ page, itemKey, buttonProps }) => (
 *     <Pagination.Item key={itemKey}>
 *       {typeof page === 'number' && (
 *         <Pagination.Button {...buttonProps} aria-label={`Side ${page}`}>
 *           {page}
 *         </Pagination.Button>
 *       )}
 *     </Pagination.Item>
 *   ))}
 *   <Pagination.Item>
 *     <Pagination.Button {...nextButtonProps}>Neste</Pagination.Button>
 *   </Pagination.Item>
 * </Pagination>
 **/
export const usePagination = ({
  currentPage = 1,
  setCurrentPage,
  onChange,
  totalPages = 1,
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
          /**
           * Page number or "ellipsis" for the ellipsis item
           */
          page: page || 'ellipsis',
          /**
           * Unique key for the item
           */
          itemKey: page ? `page-${page}` : `ellipsis-${index}`, // React key utility
          /**
           * Properties to spread on Pagination.Button
           */
          buttonProps: (page
            ? {
                'aria-current': page === currentPage ? 'page' : undefined,
                onClick: handleClick(page),
                variant: page === currentPage ? 'primary' : 'tertiary',
              }
            : null) as PaginationButtonProps | null,
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
