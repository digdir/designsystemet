import type { ChangeEvent, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import { RadioButton } from '../RadioButton';
import type { FieldSetProps } from '../FieldSet';
import { FieldSet } from '../FieldSet';
import { usePrevious, useUpdate } from '../../hooks';
import { areItemsUnique } from '../../utils';
import type { RadioButtonProps } from '../RadioButton';

import classes from './RadioGroup.module.css';

export type RadioGroupItem = Omit<
  RadioButtonProps,
  'checked' | 'error' | 'name' | 'onChange' | 'showLabel' | 'size'
>;

export interface RadioGroupProps {
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
  fieldSetProps?: Partial<FieldSetProps>;
}

const RadioGroup = ({
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
}: RadioGroupProps) => {
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
    <FieldSet
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
          <RadioButton
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
    </FieldSet>
  );
};

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
