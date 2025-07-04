import { ChipButton, ChipCheckbox, ChipRadio, ChipRemovable } from './chips';

const Chip = {
  Button: ChipButton,
  Checkbox: ChipCheckbox,
  Radio: ChipRadio,
  Removable: ChipRemovable,
};

Chip.Button.displayName = 'Chip.Button';
Chip.Checkbox.displayName = 'Chip.Checkbox';
Chip.Radio.displayName = 'Chip.Radio';
Chip.Removable.displayName = 'Chip.Removable';

export type {
  ChipButtonProps,
  ChipCheckboxProps,
  ChipRadioProps,
  ChipRemovableProps,
} from './chips';
export { Chip, ChipButton, ChipCheckbox, ChipRadio, ChipRemovable };
