import { ToggleGroup as ToggleGroupRoot } from './ToggleGroup';
import { ToggleGroupItem } from './ToggleGroupItem/ToggleGroupItem';

export type { ToggleGroupProps } from './ToggleGroup';
export type { ToggleGroupItemProps } from './ToggleGroupItem/ToggleGroupItem';

type ToggleGroupComponent = typeof ToggleGroupRoot & {
  Item: typeof ToggleGroupItem;
};

const ToggleGroup = ToggleGroupRoot as ToggleGroupComponent;

ToggleGroup.Item = ToggleGroupItem;

ToggleGroup.Item.displayName = 'ToggleGroup.Item';

export { ToggleGroup, ToggleGroupItem };
