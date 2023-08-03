import type { CheckboxProps } from './Checkbox';
import type { CheckboxGroupProps } from './Group';
import { Checkbox as CheckboxParent } from './Checkbox';
import { CheckboxGroup } from './Group';

type CheckboxComponent = typeof CheckboxParent & {
  /**
   * Grouping  multiple `Radio` together.
   * @example
   * <Radio.Group legend="Are you 18 years or older?">
   *    <Radio value="Yes">Yes</Radio>
   *    <Radio value="No">No</Radio>
   * </Radio.Group>
   */
  Group: typeof CheckboxGroup;
};

/** `<input> element with `type="checkbox"` used for selecting one option */
const Checkbox = CheckboxParent as CheckboxComponent;

Checkbox.Group = CheckboxGroup;

Checkbox.Group.displayName = 'Checkbox.Group';

export type { CheckboxProps, CheckboxGroupProps };

export { Checkbox };
