import type { ChangeEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { LegacyRadioButton } from '../LegacyRadioButton';
import type { LegacyFieldSetProps } from '../LegacyFieldSet';
import { LegacyFieldSet } from '../LegacyFieldSet';
import { usePrevious, useUpdate } from '../../../hooks';
import { areItemsUnique } from '../../../utilities';
import type { LegacyRadioButtonProps } from '../LegacyRadioButton';

import classes from './RadioGroup.module.css';

export type RadioGroupItem = Omit<
  LegacyRadioButtonProps,
  'checked' | 'error' | 'name' | 'onChange' | 'showLabel' | 'size'
>;

export interface LegacyRadioGroupProps {
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  items: RadioGroupItem[];
  legend?: ReactNode;
  name: string;
  onChange?: (value?: string) => void;
  presentation?: boolean;
  size?: 'small' | 'xsmall';
  value?: string;
  variant?: 'vertical' | 'horizontal';
  fieldSetProps?: Partial<LegacyFieldSetProps>;
}
/**
 *
 * @note
 * Replaced by new {@link https://storybook.designsystemet.no/?path=/docs/komponenter-radio-group--docs Radio.Group} component.
 */
const LegacyRadioGroup = ({
  description,
  disabled,
  error,
  helpText,
  items,
  legend,
  name,
  onChange,
  presentation,
  size = 'small',
  value,
  variant = 'vertical',
  fieldSetProps,
}: LegacyRadioGroupProps) => {
  if (!areItemsUnique(items.map((item) => item.value))) {
    throw Error('Each value in the radio group must be unique.');
  }

  const [checkedValue, setCheckedValue] = useState<string | undefined>(value);

  useEffect(() => {
    setCheckedValue(value);
  }, [value]);

  const prevCheckedValue = usePrevious(checkedValue);

  useUpdate(() => {
    onChange &&
      !disabled &&
      prevCheckedValue !== checkedValue &&
      onChange(checkedValue);
  }, [checkedValue, disabled, onChange]);

  const changeHandler = (val: string) => (e: ChangeEvent<HTMLInputElement>) =>
    e.target.checked && setCheckedValue(val);

  return (
    <LegacyFieldSet
      description={description}
      disabled={disabled}
      error={error}
      helpText={helpText}
      legend={legend}
      size={size}
      {...fieldSetProps}
    >
      <div
        className={[classes.radioGroup, classes[variant], classes[size]].join(
          ' ',
        )}
        role={presentation ? undefined : 'radiogroup'}
      >
        {items.map((radio) => (
          <LegacyRadioButton
            {...radio}
            checked={radio.value === checkedValue}
            disabled={disabled || radio.disabled}
            error={!!error}
            helpText={radio.helpText}
            key={radio.value}
            name={name}
            onChange={changeHandler(radio.value)}
            presentation={presentation}
            size={size}
          />
        ))}
      </div>
    </LegacyFieldSet>
  );
};

LegacyRadioGroup.displayName = 'LegacyRadioGroup';

export { LegacyRadioGroup };
