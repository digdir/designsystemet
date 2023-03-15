import type { ChangeEvent, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import { RadioButton, RadioButtonSize } from '../RadioButton';
import { FieldSet, FieldSetSize } from '../FieldSet';
import { usePrevious, useUpdate } from '../../hooks';
import { areItemsUnique } from '../../utils';
import type { RadioButtonProps } from '../RadioButton';

import classes from './RadioGroup.module.css';

export type RadioGroupItem = Omit<
  RadioButtonProps,
  'checked' | 'error' | 'name' | 'onChange' | 'showLabel' | 'size'
>;

export enum RadioGroupSize {
  Xsmall = 'xsmall',
  Small = 'small',
}

export enum RadioGroupVariant {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export interface RadioGroupProps {
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: string;
  items: RadioGroupItem[];
  legend?: ReactNode;
  name: string;
  onChange?: (value?: string) => void;
  presentation?: boolean;
  size?: RadioGroupSize;
  value?: string;
  variant?: RadioGroupVariant;
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
  size = RadioGroupSize.Small,
  value,
  variant = RadioGroupVariant.Vertical,
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

  const [fieldSetSize, radioButtonSize] =
    size === RadioGroupSize.Xsmall
      ? [FieldSetSize.Xsmall, RadioButtonSize.Xsmall]
      : [FieldSetSize.Small, RadioButtonSize.Small];

  return (
    <FieldSet
      description={description}
      disabled={disabled}
      error={error}
      helpText={helpText}
      legend={legend}
      size={fieldSetSize}
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
            size={radioButtonSize}
          />
        ))}
      </div>
    </FieldSet>
  );
};

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
