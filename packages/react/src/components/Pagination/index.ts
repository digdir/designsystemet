import { Pagination as PaginationParent } from './Pagination';
import { PaginationButton } from './PaginationButton';
import { PaginationItem } from './PaginationItem';
import { PaginationList } from './PaginationList';

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

export type { PaginationProps } from './Pagination';
export type { PaginationButtonProps } from './PaginationButton';
export type { PaginationListProps } from './PaginationList';
export type { PaginationItemProps } from './PaginationItem';

export { Pagination, PaginationList, PaginationItem, PaginationButton };
