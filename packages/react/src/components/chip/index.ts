import { ChipButton, ChipCheckbox, ChipRadio, ChipRemovable } from './chips';

type ChipCompondProps = {
  /**
   * Chip.Button used for interaction
   *
   * @example
   * <Chip.Button>Click me</Chip.Button>
   */
  Button: typeof ChipButton;
  /**
   * Chip.Checkbox used for multiselection
   *
   * @example
   * <Chip.Checkbox name="language" value="nynorsk">Nynorsk</Chip.Checkbox>
   * <Chip.Checkbox name="language" value="bokmål">Bokmål</Chip.Checkbox>
   */
  Checkbox: typeof ChipCheckbox;
  /**
   * Chip.Radio used for single selection
   *
   * @example
   * <Chip.Radio name="language" value="nynorsk">Nynorsk</Chip.Radio>
   * <Chip.Radio name="language" value="bokmål">Bokmål</Chip.Radio>
   */
  Radio: typeof ChipRadio;
  /**
   * Chip.Removable used for interaction
   *
   * @example
   * <Chip.Removable>Click to remove me</Chip.Removable>
   */
  Removable: typeof ChipRemovable;
};

const Chip: ChipCompondProps = {
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
