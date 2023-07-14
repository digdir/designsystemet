import { ChipBase as ParentChip } from './_ChipBase';
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

export type { RemovableChipProps, ToggleChipProps, ChipGroupProps };
export { Chip };
