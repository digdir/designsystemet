import { Radio as RadioParent } from './Radio';
import { RadioGroup } from './RadioGroup';

/** `<input> element with `type="radio"` used for selecting one option */
const Radio = Object.assign(RadioParent, {
  /**
   * Grouping  multiple `Radio` together.
   * @example
   * <Fieldset legend="Are you 18 years or older?">
   *    <Radio name="above-18" label="Yes" value="Yes" />
   *    <Radio name="above-18" label="No" value="No" />
   * </Fieldset>
   */
  Group: RadioGroup,
});

Radio.Group.displayName = 'Radio.Group'; // TODO: Remove?

export type { RadioProps } from './Radio';
export type { RadioGroupProps } from './RadioGroup';
export { Radio, RadioGroup };
