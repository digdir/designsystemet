import { Pagination as PaginationParent } from './Pagination';
import type { PaginationProps } from './Pagination';
import { PaginationButton } from './PaginationButton';
import type { PaginationButtonProps } from './PaginationButton';
import { PaginationContent } from './PaginationContent';
import type { PaginationContentProps } from './PaginationContent';
import { PaginationEllipsis } from './PaginationEllipsis';
import type { PaginationEllipsisProps } from './PaginationEllipsis';
import { PaginationItem } from './PaginationItem';
import type { PaginationItemProps } from './PaginationItem';
import { PaginationNext, PaginationPrevious } from './PaginationNextPrev';
import type {
  PaginationNextProps,
  PaginationPreviousProps,
} from './PaginationNextPrev';
import { PaginationRoot } from './PaginationRoot';

type PaginationComponent = typeof PaginationParent & {
  Root: typeof PaginationRoot;
  Content: typeof PaginationContent;
  Item: typeof PaginationItem;
  Button: typeof PaginationButton;
  Ellipsis: typeof PaginationEllipsis;
  Previous: typeof PaginationPrevious;
  Next: typeof PaginationNext;
};

const Pagination = PaginationParent as PaginationComponent;

Pagination.Root = PaginationRoot;
Pagination.Content = PaginationContent;
Pagination.Item = PaginationItem;
Pagination.Button = PaginationButton;
Pagination.Ellipsis = PaginationEllipsis;
Pagination.Previous = PaginationPrevious;
Pagination.Next = PaginationNext;

Pagination.Root.displayName = 'Pagination.Root';
Pagination.Content.displayName = 'Pagination.Content';
Pagination.Item.displayName = 'Pagination.Item';
Pagination.Button.displayName = 'Pagination.Button';
Pagination.Ellipsis.displayName = 'Pagination.Ellipsis';
Pagination.Previous.displayName = 'Pagination.Previous';
Pagination.Next.displayName = 'Pagination.Next';

export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationButtonProps,
  PaginationEllipsisProps,
  PaginationPreviousProps,
  PaginationNextProps,
};

export {
  Pagination,
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
};

export { usePagination } from './usePagination';
export type { UsePaginationProps } from './usePagination';
