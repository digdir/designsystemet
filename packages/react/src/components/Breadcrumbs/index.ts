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

/* TODO CODE: Discuss using could we instead do this?
const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  Nav: BreadcrumbsNav,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Mobile: BreadcrumbsMobile,
};
*/

type BreadcrumbsComponent = {
  Root: typeof BreadcrumbsRoot;
  Nav: typeof BreadcrumbsNav;
  List: typeof BreadcrumbsList;
  Item: typeof BreadcrumbsItem;
  Link: typeof BreadcrumbsLink;
};

const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  Nav: BreadcrumbsNav,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
} as BreadcrumbsComponent;

Breadcrumbs.Root = BreadcrumbsRoot;
Breadcrumbs.Nav = BreadcrumbsNav;
Breadcrumbs.List = BreadcrumbsList;
Breadcrumbs.Item = BreadcrumbsItem;
Breadcrumbs.Link = BreadcrumbsLink;

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
