import type { PaginationProps } from './Pagination';
import { Pagination as PaginationSingle } from './Pagination';
import PaginationContent from './PaginationContent';
import type { PaginationContentProps } from './PaginationContent';
import type { PaginationEllipsisProps } from './PaginationEllipsis';
import PaginationEllipsis from './PaginationEllipsis';
import PaginationItem from './PaginationItem';
import type { PaginationItemProps } from './PaginationItem';
import PaginationLink from './PaginationButton';
import type { PaginationLinkProps } from './PaginationButton';
import type {
  PaginationNextProps,
  PaginationPreviousProps,
} from './PaginationNextPrev';
import { PaginationNext, PaginationPrevious } from './PaginationNextPrev';
import PaginationRoot from './PaginationRoot';

type PaginationComponent = typeof PaginationSingle & {
  Root: typeof PaginationRoot;
  Content: typeof PaginationContent;
  Item: typeof PaginationItem;
  Link: typeof PaginationLink;
  Ellipsis: typeof PaginationEllipsis;
  Previous: typeof PaginationPrevious;
  Next: typeof PaginationNext;
};

const Pagination = PaginationSingle as PaginationComponent;

Pagination.Root = PaginationRoot;
Pagination.Content = PaginationContent;
Pagination.Item = PaginationItem;
Pagination.Link = PaginationLink;
Pagination.Ellipsis = PaginationEllipsis;
Pagination.Previous = PaginationPrevious;
Pagination.Next = PaginationNext;

Pagination.Root.displayName = 'Pagination.Root';
Pagination.Content.displayName = 'Pagination.Content';
Pagination.Item.displayName = 'Pagination.Item';
Pagination.Link.displayName = 'Pagination.Link';
Pagination.Ellipsis.displayName = 'Pagination.Ellipsis';
Pagination.Previous.displayName = 'Pagination.Previous';
Pagination.Next.displayName = 'Pagination.Next';

export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationEllipsisProps,
  PaginationPreviousProps,
  PaginationNextProps,
};

export {
  Pagination,
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
};
