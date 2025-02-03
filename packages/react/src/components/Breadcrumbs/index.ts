import { Breadcrumbs as BreadcrumbsParent } from './Breadcrumbs';
import { BreadcrumbsItem } from './BreadcrumbsItem';
import { BreadcrumbsLink } from './BreadcrumbsLink';
import { BreadcrumbsList } from './BreadcrumbsList';

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
export type { BreadcrumbsListProps } from './BreadcrumbsList';
export type { BreadcrumbsItemProps } from './BreadcrumbsItem';
export type { BreadcrumbsLinkProps } from './BreadcrumbsLink';
export { BreadcrumbsList, BreadcrumbsItem, BreadcrumbsLink };
