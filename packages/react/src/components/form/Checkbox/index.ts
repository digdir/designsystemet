import type { ChangeEvent } from 'react';
import { Checkbox as CheckboxParent } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

/** `<input> element with `type="checkbox"` used for selecting one option */
const Checkbox = Object.assign(CheckboxParent, {
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
  Group: CheckboxGroup, // TODO: Remove?
  getValues: ({ target }: ChangeEvent<HTMLInputElement>) =>
    Array.from((target.form ?? document).getElementsByTagName('input'))
      .filter(({ name, checked }) => name === target.name && checked)
      .map(({ value }) => value),
});

Checkbox.Group.displayName = 'Checkbox.Group';

export type { CheckboxProps } from './Checkbox';
export type { CheckboxGroupProps } from './CheckboxGroup';
export { Checkbox, CheckboxGroup };
