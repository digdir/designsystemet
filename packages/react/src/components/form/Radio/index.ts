import type { RadioProps } from './Radio';
import type { RadioGroupProps } from './Group';
import { Radio as RadioParent } from './Radio';
import { RadioGroup } from './Group';

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

const Radio = RadioParent as RadioComponent;

Radio.Group = RadioGroup;

Radio.Group.displayName = 'Radio.Group';

export type { RadioProps, RadioGroupProps };

export { Radio };
