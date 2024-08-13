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

/**
 * Breadcrumbs are used to visualize the current page path.
 * @example
 * <Breadcrumbs.Root>
 *  <Breadcrumbs.Link aria-label="Go back to level 2">Level 2</Breadcrumbs.Link>
 *  <Breadcrumbs.Nav aria-label="You are here:">
 *   <Breadcrumbs.List>
 *    <Breadcrumbs.Item><Breadcrumbs.Link>Level 1</Breadcrumbs.Link></Breadcrumbs.Item>
 *    <Breadcrumbs.Item><Breadcrumbs.Link>Level 2</Breadcrumbs.Link></Breadcrumbs.Item>
 *    <Breadcrumbs.Item><Breadcrumbs.Link>Level 3</Breadcrumbs.Link></Breadcrumbs.Item>
 *    <Breadcrumbs.Item><Breadcrumbs.Link>Level 4</Breadcrumbs.Link></Breadcrumbs.Item>
 *   </Breadcrumbs.List>
 *  </Breadcrumbs.Nav>
 * <Breadcrumbs.Root>
 */
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
