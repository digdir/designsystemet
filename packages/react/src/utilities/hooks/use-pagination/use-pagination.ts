import { pagination } from '@digdir/designsystemet-web';
import type { MouseEvent } from 'react';
import { useMemo } from 'react';

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
      pages: pages.map((page, index) => ({
        /**
         * Page number or "ellipsis" for the ellipsis item
         */
        page: page.value || 'ellipsis',
        /**
         * Unique key for the item
         */
        itemKey: page.value ? `page-${page.value}` : `ellipsis-${index}`, // React key utility
        /**
         * Properties to spread on Pagination.Button
         */
        buttonProps: {
          'aria-current': page['aria-current'],
          onClick: handleClick(page.value),
        },
      })),
      /** Properties to spread on Pagination.Button used for previous navigation */
      prevButtonProps: { onClick: handleClick(prev.value) },
      /** Properties to spread on Pagination.Button used for next navigation */
      nextButtonProps: { onClick: handleClick(next.value) },
      /** Indication if previous page action should be shown or not */
      hasPrev: !!prev.value,
      /** Indication if next page action should be shown or not */
      hasNext: !!next.value,
    };
  }, [current, total, show]);
