import { BreadcrumbsItem } from './BreadcrumbsItem';
import { BreadcrumbsLink } from './BreadcrumbsLink';
import { BreadcrumbsList } from './BreadcrumbsList';
import { BreadcrumbsNav } from './BreadcrumbsNav';
import { BreadcrumbsRoot } from './BreadcrumbsRoot';

export type { BreadcrumbsRootProps } from './BreadcrumbsRoot';
export type { BreadcrumbsNavProps } from './BreadcrumbsNav';
export type { BreadcrumbsListProps } from './BreadcrumbsList';
export type { BreadcrumbsItemProps } from './BreadcrumbsItem';
export type { BreadcrumbsLinkProps } from './BreadcrumbsLink';

const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  Nav: BreadcrumbsNav,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
};

Breadcrumbs.Root.displayName = 'Breadcrumbs.Root';
Breadcrumbs.Nav.displayName = 'Breadcrumbs.Nav';
Breadcrumbs.List.displayName = 'Breadcrumbs.List';
Breadcrumbs.Item.displayName = 'Breadcrumbs.Item';
Breadcrumbs.Link.displayName = 'Breadcrumbs.Link';

export {
  Breadcrumbs,
  BreadcrumbsRoot,
  BreadcrumbsNav,
  BreadcrumbsList,
  BreadcrumbsItem,
  BreadcrumbsLink,
};
