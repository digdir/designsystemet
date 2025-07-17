import { ChipButton, ChipCheckbox, ChipRadio, ChipRemovable } from './chips';

type Chip = {
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

const ChipComponent: Chip = {
  Button: ChipButton,
  Checkbox: ChipCheckbox,
  Radio: ChipRadio,
  Removable: ChipRemovable,
};

ChipComponent.Button.displayName = 'Chip.Button';
ChipComponent.Checkbox.displayName = 'Chip.Checkbox';
ChipComponent.Radio.displayName = 'Chip.Radio';
ChipComponent.Removable.displayName = 'Chip.Removable';

export type {
  ChipButtonProps,
  ChipCheckboxProps,
  ChipRadioProps,
  ChipRemovableProps,
} from './chips';
export {
  ChipComponent as Chip,
  ChipButton,
  ChipCheckbox,
  ChipRadio,
  ChipRemovable,
};
