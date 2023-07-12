import { Chip as ParentChip } from './Chip';
import type { ChipProps } from './Chip';
import { Group } from './Group';
import type { ChipGroupProps } from './Group';
import { RemovableChip } from './Removable';
import type { RemovableChipProps } from './Removable';
import { ToggleChip, type ToggleChipProps } from './Toggle';

type ChipComponent = typeof ParentChip & {
  Group: typeof Group;
  Removable: typeof RemovableChip;
  Toggle: typeof ToggleChip;
};

const Chip = ParentChip as ChipComponent;

Chip.Group = Group;
Chip.Removable = RemovableChip;
Chip.Toggle = ToggleChip;

export type { ChipProps, RemovableChipProps, ToggleChipProps, ChipGroupProps };
export { Chip };
