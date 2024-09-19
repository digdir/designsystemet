import { Breadcrumbs as BreadcrumbsParent } from './Breadcrumbs';
import { BreadcrumbsItem } from './BreadcrumbsItem';
import { BreadcrumbsLink } from './BreadcrumbsLink';
import { BreadcrumbsList } from './BreadcrumbsList';

/**
 * Breadcrumbs are used to visualize the current page path.
 * @example
 * <Breadcrumbs aria-label="You are here:">
 *  <Breadcrumbs.Link aria-label="Go back to level 2">Level 2</Breadcrumbs.Link>
 *  <Breadcrumbs.List>
 *   <Breadcrumbs.Item><Breadcrumbs.Link>Level 1</Breadcrumbs.Link></Breadcrumbs.Item>
 *   <Breadcrumbs.Item><Breadcrumbs.Link>Level 2</Breadcrumbs.Link></Breadcrumbs.Item>
 *   <Breadcrumbs.Item><Breadcrumbs.Link>Level 3</Breadcrumbs.Link></Breadcrumbs.Item>
 *   <Breadcrumbs.Item><Breadcrumbs.Link>Level 4</Breadcrumbs.Link></Breadcrumbs.Item>
 *  </Breadcrumbs.List>
 * <Breadcrumbs>
 */
export const Breadcrumbs = Object.assign(BreadcrumbsParent, {
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
});

Breadcrumbs.List.displayName = 'Breadcrumbs.List';
Breadcrumbs.Item.displayName = 'Breadcrumbs.Item';
Breadcrumbs.Link.displayName = 'Breadcrumbs.Link';

export type { BreadcrumbsProps } from './Breadcrumbs';
export type { BreadcrumbsListProps } from './BreadcrumbsList';
export type { BreadcrumbsItemProps } from './BreadcrumbsItem';
export type { BreadcrumbsLinkProps } from './BreadcrumbsLink';
export { BreadcrumbsList, BreadcrumbsItem, BreadcrumbsLink };
