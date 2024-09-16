import { ToggleGroup as ToggleGroupParent } from './ToggleGroup';
import { ToggleGroupItem } from './ToggleGroupItem';

export type { ToggleGroupProps } from './ToggleGroup';
export type { ToggleGroupItemProps } from './ToggleGroupItem';

type ToggleGroupComponent = typeof ToggleGroupParent & {
  Item: typeof ToggleGroupItem;
};

/**
 * Display a group of buttons that can be toggled between.
 * @example
 * ```tsx
 * <ToggleGroup onChange={(value) => console.log(value)}>
 *   <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 *   <ToggleGroup.Item value='2'>Toggle 2</ToggleGroup.Item>
 *   <ToggleGroup.Item value='3'>Toggle 3</ToggleGroup.Item>
 * </ToggleGroup>
 * ```
 */
const ToggleGroup = ToggleGroupParent as ToggleGroupComponent;

ToggleGroup.Item = ToggleGroupItem;

ToggleGroup.Item.displayName = 'ToggleGroup.Item';

export { ToggleGroup, ToggleGroupItem };
