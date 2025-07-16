import { Breadcrumbs as BreadcrumbsParent } from './breadcrumbs';
import { BreadcrumbsItem } from './breadcrumbs-item';
import { BreadcrumbsLink } from './breadcrumbs-link';
import { BreadcrumbsList } from './breadcrumbs-list';

type Breadcrumbs = typeof BreadcrumbsParent & {
  /**
   * Component that provides a Breadcrumbs item.
   *
   * Place as a descendant of `Breadcrumbs.List`
   *
   * @example
   * <Breadcrumbs.List>
   *   <Breadcrumbs.Item>
   *     <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
   *   </Breadcrumbs.Item>
   * </Breadcrumbs.List>
   */
  Item: typeof BreadcrumbsItem;
  /**
   * Component that provides a link for the Breadcrumbs.
   *
   * Place as a descendant of `Breadcrumbs`
   *
   * @example
   * <Breadcrumbs>
   *   <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
   * </Breadcrumbs>
   */
  Link: typeof BreadcrumbsLink;
  /**
   * Component that provides a list of Breadcrumbs items.
   *
   * Place as a descendant of `Breadcrumbs`
   *
   * @example
   * <Breadcrumbs>
   *   <Breadcrumbs.List>
   *     <Breadcrumbs.Item>
   *       <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
   *     </Breadcrumbs.Item>
   *     <Breadcrumbs.Item>
   *       <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
   *     </Breadcrumbs.Item>
   *   </Breadcrumbs.List>
   * </Breadcrumbs>
   */
  List: typeof BreadcrumbsList;
};

/**
 * `Breadcrumbs` is a component that displays a list of breadcrumbs.
 *
 * @example
 * <Breadcrumbs aria-label='Du er her:'>
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
export const Breadcrumbs: Breadcrumbs = Object.assign(BreadcrumbsParent, {
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
});

Breadcrumbs.List.displayName = 'Breadcrumbs.List';
Breadcrumbs.Item.displayName = 'Breadcrumbs.Item';
Breadcrumbs.Link.displayName = 'Breadcrumbs.Link';

export type { BreadcrumbsProps } from './breadcrumbs';
export type { BreadcrumbsItemProps } from './breadcrumbs-item';
export type { BreadcrumbsLinkProps } from './breadcrumbs-link';
export type { BreadcrumbsListProps } from './breadcrumbs-list';
export { BreadcrumbsList, BreadcrumbsItem, BreadcrumbsLink };
