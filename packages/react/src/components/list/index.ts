import { ListItem } from './list-item';
import { ListOrdered, ListUnordered } from './lists';

type List = {
  /**
   * Component that provides a list item.
   *
   * @example
   * <List.Item>Item</List.Item>
   */
  Item: typeof ListItem;
  /**
   * List.Ordered component, used to display a list of items.
   * Renders a native `ol` element.
   *
   * @example
   * <List.Ordered>
   *   <List.Item>Item 1</List.Item>
   *   <List.Item>Item 2</List.Item>
   * </List.Ordered>
   */
  Ordered: typeof ListOrdered;
  /**
   * List.Unordered component, used to display a list of items.
   * Renders a native `ul` element.
   *
   * @example
   * <List.Unordered>
   *   <List.Item>Item 1</List.Item>
   *   <List.Item>Item 2</List.Item>
   * </List.Unordered>
   */
  Unordered: typeof ListUnordered;
};

const ListComponent: List = {
  Item: ListItem,
  Ordered: ListOrdered,
  Unordered: ListUnordered,
};

ListComponent.Item.displayName = 'List.Item';
ListComponent.Ordered.displayName = 'List.Ordered';
ListComponent.Unordered.displayName = 'List.Unordered';

export type { ListItemProps } from './list-item';
export type { ListOrderedProps, ListUnorderedProps } from './lists';
export { ListComponent as List, ListOrdered, ListUnordered, ListItem };
