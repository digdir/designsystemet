import type { CheckboxProps } from './Checkbox';
import { Checkbox as CheckboxParent } from './Checkbox';
import type { CheckboxGroupProps } from './CheckboxGroup';
import { CheckboxGroup } from './CheckboxGroup';

type CheckboxComponent = typeof CheckboxParent & {
  /**
   * Grouping  multiple `Checkbox` together.
   * @example
   * <Checkbox.Group legend="What would your D&D party like to eat?">
   *    <Checkbox value="elfsalad">Wood Elf forest salad</Checkbox>
   *    <Checkbox value="firecakes">Fire breath rice cakes</Checkbox>
   *    <Checkbox value="dumplings">Chicken-something dumplings</Checkbox>
   *    <Checkbox value="ribs">Sembian honey-glazed rothè ribs</Checkbox>
   * </Checkbox.Group>
   */
  Group: typeof CheckboxGroup;
};

/** `<input> element with `type="checkbox"` used for selecting one option */
const Checkbox = CheckboxParent as CheckboxComponent;

Checkbox.Group = CheckboxGroup;

Checkbox.Group.displayName = 'Checkbox.Group';

export type { CheckboxProps, CheckboxGroupProps };

export { Checkbox, CheckboxGroup };
