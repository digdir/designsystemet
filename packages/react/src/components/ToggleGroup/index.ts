import { ToggleGroupRoot } from './ToggleGroupRoot';
import { ToggleGroupItem } from './ToggleGroupItem/ToggleGroupItem';

export type { ToggleGroupProps } from './ToggleGroupRoot';
export type { ToggleGroupItemProps } from './ToggleGroupItem/ToggleGroupItem';

type ToggleGroupComponent = {
  Root: typeof ToggleGroupRoot;
  Item: typeof ToggleGroupItem;
};

/**
 * Display a group of buttons that can be toggled between.
 * @example
 * ```tsx
 * <ToggleGroup.Root onChange={(value) => console.log(value)}>
 *   <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 *   <ToggleGroup.Item value='2'>Toggle 2</ToggleGroup.Item>
 *   <ToggleGroup.Item value='3'>Toggle 3</ToggleGroup.Item>
 * </ToggleGroup.Root>
 * ```
 */
const ToggleGroup = {} as ToggleGroupComponent;

ToggleGroup.Root = ToggleGroupRoot;
ToggleGroup.Item = ToggleGroupItem;

ToggleGroup.Root.displayName = 'ToggleGroup.Root';
ToggleGroup.Item.displayName = 'ToggleGroup.Item';

export { ToggleGroup, ToggleGroupRoot, ToggleGroupItem };
