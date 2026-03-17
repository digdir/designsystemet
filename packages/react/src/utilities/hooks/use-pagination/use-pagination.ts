import { pagination } from '@digdir/designsystemet-web';
import type { MouseEvent } from 'react';
import { useMemo } from 'react';
import type { PaginationButtonProps } from '../../../components';

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
  currentPage: current = 1,
  setCurrentPage,
  onChange,
  totalPages: total = 1,
  showPages: show = 7,
}: UsePaginationProps) =>
  useMemo(() => {
    const { next, prev, pages } = pagination({ current, total, show });
    const handleClick = (page: number) => (event: MouseEvent<HTMLElement>) => {
      if (page < 1 || page > total) return event.preventDefault(); // Prevent out of bounds navigation
      onChange?.(event, page);
      if (!event.defaultPrevented) setCurrentPage?.(page); // Allow stopping change by calling event.preventDefault() in onChange
    };

    return {
      /** Number of steps */
      pages: pages.map(({ page, current }, index) => ({
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
              'aria-current': current ? 'true' : undefined,
              onClick: handleClick(page),
            }
          : null) as PaginationButtonProps | null,
      })),
      /** Properties to spread on Pagination.Button used for previous naviagation */
      prevButtonProps: {
        'aria-hidden': !prev, // Using aria-hidden to support all HTML elements because of potential asChild
        onClick: handleClick(prev),
        variant: 'tertiary',
      } as PaginationButtonProps,
      /** Properties to spread on Pagination.Button used for next naviagation */
      nextButtonProps: {
        'aria-hidden': !next, // Using aria-hidden to support all HTML elements because of potential asChild
        onClick: handleClick(next),
        variant: 'tertiary',
      } as PaginationButtonProps,
      /** Indication if previous page action should be shown or not */
      hasPrev: !!prev,
      /** Indication if next page action should be shown or not */
      hasNext: !!next,
    };
  }, [current, total, show]);
