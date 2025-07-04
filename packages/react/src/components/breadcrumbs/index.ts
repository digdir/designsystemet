import { Breadcrumbs as BreadcrumbsParent } from './breadcrumbs';
import { BreadcrumbsItem } from './breadcrumbs-item';
import { BreadcrumbsLink } from './breadcrumbs-link';
import { BreadcrumbsList } from './breadcrumbs-list';

/**
 * `Breadcrumbs` is a component that displays a list of breadcrumbs.
 *
 * @example
 * <Breadcrumbs aria-label='Du er her:' {...args}>
 *  <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 1'>
 *    Nivå 1
 *  </Breadcrumbs.Link>
 *  <Breadcrumbs.List>
 *    <Breadcrumbs.Item>
 *      <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
 *    </Breadcrumbs.Item>
 *    <Breadcrumbs.Item>
 *      <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
 *    </Breadcrumbs.Item>
 *  </Breadcrumbs.List>
 * </Breadcrumbs>
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
export type { BreadcrumbsItemProps } from './breadcrumbs-item';
export type { BreadcrumbsLinkProps } from './breadcrumbs-link';
export type { BreadcrumbsListProps } from './breadcrumbs-list';
export { BreadcrumbsList, BreadcrumbsItem, BreadcrumbsLink };
