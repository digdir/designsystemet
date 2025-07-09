import { ToggleGroup as ToggleGroupParent } from './toggle-group';
import { ToggleGroupItem } from './toggle-group-item';

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
const ToggleGroup = Object.assign(ToggleGroupParent, {
  Item: ToggleGroupItem,
});

ToggleGroup.Item.displayName = 'ToggleGroup.Item';

export type { ToggleGroupProps } from './toggle-group';
export type { ToggleGroupItemProps } from './toggle-group-item';
export { ToggleGroup, ToggleGroupItem };
