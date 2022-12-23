import type { ChangeEventHandler } from 'react';
import React from 'react';
import cn from 'classnames';

import {
  CheckboxRadioTemplate,
  CheckboxRadioTemplateSize,
} from '../_CheckboxRadioTemplate';

import classes from './RadioButton.module.css';

export enum RadioButtonSize {
  Xsmall = 'xsmall',
  Small = 'small',
}

export interface RadioButtonProps {
  checked?: boolean;
  className?: string;
  description?: string;
  disabled?: boolean;
  error?: boolean;
  hideLabel?: boolean;
  label?: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  radioId?: string;
  size?: RadioButtonSize;
  value: string;
}

export const RadioButton = ({
  checked,
  description,
  disabled,
  error,
  hideLabel,
  label,
  name,
  onChange,
  radioId,
  size = RadioButtonSize.Small,
  value,
}: RadioButtonProps) => (
  <CheckboxRadioTemplate
    checked={checked}
    className={cn(
      classes.radio,
      classes[size],
      checked && classes.checked,
      error && classes.error,
      disabled && classes.disabled,
    )}
    description={description}
    disabled={disabled}
    hideLabel={hideLabel}
    inputId={radioId}
    label={label}
    name={name}
    onChange={onChange}
    size={
      size === RadioButtonSize.Xsmall
        ? CheckboxRadioTemplateSize.Xsmall
        : CheckboxRadioTemplateSize.Small
    }
    type='radio'
    value={value}
  >
    <span className={classes.visibleButton}>
      <span className={classes.checkmark} />
    </span>
  </CheckboxRadioTemplate>
);
