import { Pagination as PaginationParent } from './pagination';
import { PaginationButton } from './pagination-button';
import { PaginationItem } from './pagination-item';
import { PaginationList } from './pagination-list';

/**
 * Pagination component, used to navigate through a list of items.
 *
 * @example
 * <Pagination>
 *   <Pagination.List>
 *     <Pagination.Item>
 *       <Pagination.Button aria-label='Forrige side'>Forrige</Pagination.Button>
 *     </Pagination.Item>
 *     <Pagination.Item>
 *       <Pagination.Button aria-label='Side 1'>1</Pagination.Button>
 *     </Pagination.Item>
 *     <Pagination.Item>
 *       <Pagination.Button aria-label='Side 2'>2</Pagination.Button>
 *     </Pagination.Item>
 *   </Pagination.List>
 * </Pagination>
 */
const Pagination = Object.assign(PaginationParent, {
  List: PaginationList,
  Item: PaginationItem,
  Button: PaginationButton,
});

Pagination.List.displayName = 'Pagination.List';
Pagination.Item.displayName = 'Pagination.Item';
Pagination.Button.displayName = 'Pagination.Button';

export type { PaginationProps } from './pagination';
export type { PaginationButtonProps } from './pagination-button';
export type { PaginationItemProps } from './pagination-item';
export type { PaginationListProps } from './pagination-list';

export { Pagination, PaginationList, PaginationItem, PaginationButton };
