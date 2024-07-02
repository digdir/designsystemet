import { ToggleGroupRoot } from './ToggleGroupRoot';
import { ToggleGroupItem } from './ToggleGroupItem/ToggleGroupItem';

export type { ToggleGroupProps } from './ToggleGroupRoot';
export type { ToggleGroupItemProps } from './ToggleGroupItem/ToggleGroupItem';

type ToggleGroupComponent = {
  Root: typeof ToggleGroupRoot;
  Item: typeof ToggleGroupItem;
};

const ToggleGroup = {} as ToggleGroupComponent;

ToggleGroup.Root = ToggleGroupRoot;
ToggleGroup.Item = ToggleGroupItem;

ToggleGroup.Root.displayName = 'ToggleGroup.Root';
ToggleGroup.Item.displayName = 'ToggleGroup.Item';

export { ToggleGroup, ToggleGroupRoot, ToggleGroupItem };
