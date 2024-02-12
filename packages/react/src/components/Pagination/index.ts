import type { PaginationProps } from './Pagination';
import { Pagination as PaginationSingle } from './Pagination';
import PaginationContent from './PaginationContent';
import type { PaginationContentProps } from './PaginationContent';
import PaginationEllipsis from './PaginationEllipsis';
import PaginationItem from './PaginationItem';
import type { PaginationItemProps } from './PaginationItem';
import PaginationLink from './PaginationLink';
import type { PaginationLinkProps } from './PaginationLink';
import PaginationRoot from './PaginationRoot';

type PaginationComponent = typeof PaginationSingle & {
  Root: typeof PaginationRoot;
  Content: typeof PaginationContent;
  Item: typeof PaginationItem;
  Link: typeof PaginationLink;
  Ellipsis: typeof PaginationEllipsis;
};

const Pagination = PaginationSingle as PaginationComponent;

Pagination.Root = PaginationRoot;
Pagination.Content = PaginationContent;
Pagination.Item = PaginationItem;
Pagination.Link = PaginationLink;
Pagination.Ellipsis = PaginationEllipsis;

Pagination.Root.displayName = 'Pagination.Root';
Pagination.Content.displayName = 'Pagination.Content';
Pagination.Item.displayName = 'Pagination.Item';
Pagination.Link.displayName = 'Pagination.Link';
Pagination.Ellipsis.displayName = 'Pagination.Ellipsis';

export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
};

export {
  Pagination,
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
};
