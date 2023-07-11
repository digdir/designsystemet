import { Chip as ParentChip } from './Chip';
import type { ChipProps } from './Chip';
import { Group } from './Group';
import type { ChipGroupProps } from './Group';
import { RemovableChip } from './Removable';
import type { RemovableChipProps } from './Removable';

type ChipComponent = typeof ParentChip & {
  Group: typeof Group;
  Removable: typeof RemovableChip;
};

const Chip = ParentChip as ChipComponent;

Chip.Group = Group;
Chip.Removable = RemovableChip;

export type { ChipProps, RemovableChipProps, ChipGroupProps };
export { Chip };
