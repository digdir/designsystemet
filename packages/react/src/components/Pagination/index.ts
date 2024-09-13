import { Pagination as PaginationParent } from './Pagination';
import { PaginationButton } from './PaginationButton';
import { PaginationEllipsis } from './PaginationEllipsis';
import { PaginationItem } from './PaginationItem';
import { PaginationList } from './PaginationList';
import { PaginationNext, PaginationPrevious } from './PaginationNextPrev';
import { PaginationRoot } from './PaginationRoot';

type PaginationComponent = typeof PaginationParent & {
  Root: typeof PaginationRoot;
  List: typeof PaginationList;
  Item: typeof PaginationItem;
  Button: typeof PaginationButton;
  Ellipsis: typeof PaginationEllipsis;
  Previous: typeof PaginationPrevious;
  Next: typeof PaginationNext;
};

const Pagination = PaginationParent as PaginationComponent;

Pagination.Root = PaginationRoot;
Pagination.List = PaginationList;
Pagination.Item = PaginationItem;
Pagination.Button = PaginationButton;
Pagination.Ellipsis = PaginationEllipsis;
Pagination.Previous = PaginationPrevious;
Pagination.Next = PaginationNext;

Pagination.Root.displayName = 'Pagination.Root';
Pagination.List.displayName = 'Pagination.List';
Pagination.Item.displayName = 'Pagination.Item';
Pagination.Button.displayName = 'Pagination.Button';
Pagination.Ellipsis.displayName = 'Pagination.Ellipsis';
Pagination.Previous.displayName = 'Pagination.Previous';
Pagination.Next.displayName = 'Pagination.Next';

export type { PaginationProps } from './Pagination';
export type { PaginationButtonProps } from './PaginationButton';
export type { PaginationListProps } from './PaginationList';
export type { PaginationEllipsisProps } from './PaginationEllipsis';
export type { PaginationItemProps } from './PaginationItem';
export type {
  PaginationNextProps,
  PaginationPreviousProps,
} from './PaginationNextPrev';

export {
  Pagination,
  PaginationRoot,
  PaginationList,
  PaginationItem,
  PaginationButton,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
};

export { usePagination } from './usePagination';
export type { UsePaginationProps } from './usePagination';
