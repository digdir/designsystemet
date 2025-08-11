import { Pagination as PaginationParent } from './pagination';
import { PaginationButton } from './pagination-button';
import { PaginationItem } from './pagination-item';
import { PaginationList } from './pagination-list';

type Pagination = typeof PaginationParent & {
  /**
   * Pagination.List component, use within a Pagination.
   *
   * @example
   * <Pagination>
   *   <Pagination.List>
   *     <Pagination.Item>
   *       <Pagination.Button aria-label='Forrige side'>Forrige</Pagination.Button>
   *     </Pagination.Item>
   *   </Pagination.List>
   * </Pagination>
   */
  List: typeof PaginationList;
  /**
   * Pagination.Item component, use within a Pagination.List.
   *
   * @example
   * <Pagination.List>
   *   <Pagination.Item>
   *     <Pagination.Button aria-label='Forrige side'>Forrige</Pagination.Button>
   *   </Pagination.Item>
   * </Pagination.List>
   */
  Item: typeof PaginationItem;
  /**
   * PaginationButton component, use within a Pagination.Item.
   *
   * @example
   * <Pagination.Item>
   *   <Pagination.Button aria-label='Forrige side'>Forrige</Pagination.Button>
   * </Pagination.Item>
   */
  Button: typeof PaginationButton;
};

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
const PaginationComponent: Pagination = Object.assign(PaginationParent, {
  List: PaginationList,
  Item: PaginationItem,
  Button: PaginationButton,
});

PaginationComponent.List.displayName = 'Pagination.List';
PaginationComponent.Item.displayName = 'Pagination.Item';
PaginationComponent.Button.displayName = 'Pagination.Button';

export type { PaginationProps } from './pagination';
export type { PaginationButtonProps } from './pagination-button';
export type { PaginationItemProps } from './pagination-item';
export type { PaginationListProps } from './pagination-list';

export {
  PaginationComponent as Pagination,
  PaginationList,
  PaginationItem,
  PaginationButton,
};
