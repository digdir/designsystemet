import { Pagination as PaginationParent } from './Pagination';
import { PaginationButton } from './PaginationButton';
import { PaginationItem } from './PaginationItem';
import { PaginationList } from './PaginationList';

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
export type { UsePaginationProps } from './usePagination';
export { Pagination, PaginationList, PaginationItem, PaginationButton };
export { usePagination } from './usePagination';
