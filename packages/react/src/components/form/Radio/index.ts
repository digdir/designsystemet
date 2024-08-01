import type { RadioGroupProps } from './Group';
import { RadioGroup } from './Group';
import type { RadioProps } from './Radio';
import { Radio as RadioParent } from './Radio';

type RadioComponent = typeof RadioParent & {
  /**
   * Grouping  multiple `Radio` together.
   * @example
   * <Radio.Group legend="Are you 18 years or older?">
   *    <Radio value="Yes">Yes</Radio>
   *    <Radio value="No">No</Radio>
   * </Radio.Group>
   */
  Group: typeof RadioGroup;
};

/** `<input> element with `type="radio"` used for selecting one option */
const Radio = RadioParent as RadioComponent;

Radio.Group = RadioGroup;

Radio.Group.displayName = 'Radio.Group';

export type { RadioProps, RadioGroupProps };

export { Radio, RadioGroup };
