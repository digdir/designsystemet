import { ToggleGroup as ToggleGroupParent } from './ToggleGroup';
import { ToggleGroupItem } from './ToggleGroupItem/ToggleGroupItem';

export type { ToggleGroupProps } from './ToggleGroup';
export type { ToggleGroupItemProps } from './ToggleGroupItem/ToggleGroupItem';

type ToggleGroupComponent = typeof ToggleGroupParent & {
  Item: typeof ToggleGroupItem;
};

const ToggleGroup = ToggleGroupParent as ToggleGroupComponent;

ToggleGroup.Item = ToggleGroupItem;

ToggleGroup.Item.displayName = 'ToggleGroup.Item';

export { ToggleGroup };
