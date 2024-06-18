import { ToggleGroupRoot } from './ToggleGroup';
import { ToggleGroupItem } from './ToggleGroupItem/ToggleGroupItem';

export type { ToggleGroupProps } from './ToggleGroup';
export type { ToggleGroupItemProps } from './ToggleGroupItem/ToggleGroupItem';

type ToggleGroupComponent = {
  Root: typeof ToggleGroupRoot;
  Item: typeof ToggleGroupItem;
};

const ToggleGroup = {} as ToggleGroupComponent;

ToggleGroup.Root = ToggleGroupRoot;
ToggleGroup.Item = ToggleGroupItem;

export { ToggleGroup, ToggleGroupRoot, ToggleGroupItem };
