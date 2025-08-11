import { ToggleGroup as ToggleGroupParent } from './toggle-group';
import { ToggleGroupItem } from './toggle-group-item';

type ToggleGroup = typeof ToggleGroupParent & {
  /**
   * A single item in a ToggleGroup.
   * @example
   * <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
   */
  Item: typeof ToggleGroupItem;
};

/**
 * Display a group of buttons that can be toggled between.
 *
 * @example
 * <ToggleGroup onChange={(value) => console.log(value)}>
 *   <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 *   <ToggleGroup.Item value='2'>Toggle 2</ToggleGroup.Item>
 *   <ToggleGroup.Item value='3'>Toggle 3</ToggleGroup.Item>
 * </ToggleGroup>
 */
const ToggleGroupComponent: ToggleGroup = Object.assign(ToggleGroupParent, {
  Item: ToggleGroupItem,
});

ToggleGroupComponent.Item.displayName = 'ToggleGroup.Item';

export type { ToggleGroupProps } from './toggle-group';
export type { ToggleGroupItemProps } from './toggle-group-item';
export { ToggleGroupComponent as ToggleGroup, ToggleGroupItem };
