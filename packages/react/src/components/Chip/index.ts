import { Group } from './Group';
import type { ChipGroupProps } from './Group';
import { RemovableChip } from './Removable';
import type { RemovableChipProps } from './Removable';
import { ToggleChip } from './Toggle';
import type { ToggleChipProps } from './Toggle/';

type ChipComponent = {
  Group: typeof Group;
  Removable: typeof RemovableChip;
  Toggle: typeof ToggleChip;
};

const Chip: ChipComponent = {
  Group: Group,
  Removable: RemovableChip,
  Toggle: ToggleChip,
};

Chip.Group.displayName = 'Chip.Group';
Chip.Removable.displayName = 'Chip.Removable';
Chip.Toggle.displayName = 'Chip.Toggle';

export type { RemovableChipProps, ToggleChipProps, ChipGroupProps };
export { Chip };
