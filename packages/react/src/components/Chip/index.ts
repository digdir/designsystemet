import { Group as ChipGroup } from './Group';
import type { ChipGroupProps } from './Group';
import { RemovableChip as ChipRemovable } from './Removable';
import type { RemovableChipProps } from './Removable';
import { ToggleChip as ChipToggle } from './Toggle';
import type { ToggleChipProps } from './Toggle/';

type ChipComponent = {
  /**
   * Grouping  multiple `Chip` together. Avoid mixing different kind of chips.
   * @example
   * <Chip.Group>
   *    <Chip.Removable>Tekst</Chip.Removable>
   *    <Chip.Removable>Tekst</Chip.Removable>
   * </Chip.Group>
   */
  Group: typeof ChipGroup;
  Removable: typeof ChipRemovable;
  Toggle: typeof ChipToggle;
};

const Chip: ChipComponent = {
  Group: ChipGroup,
  Removable: ChipRemovable,
  Toggle: ChipToggle,
};

Chip.Group.displayName = 'Chip.Group';
Chip.Removable.displayName = 'Chip.Removable';
Chip.Toggle.displayName = 'Chip.Toggle';

export type { RemovableChipProps, ToggleChipProps, ChipGroupProps };
export { Chip, ChipGroup, ChipRemovable, ChipToggle };
