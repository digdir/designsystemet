import type { ChangeEventHandler, ReactNode } from 'react';
import React from 'react';
import cn from 'classnames';

import { CheckboxRadioTemplate } from '../_CheckboxRadioTemplate';

import classes from './RadioButton.module.css';

export interface RadioButtonProps {
  checked?: boolean;
  className?: string;
  description?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  helpText?: ReactNode;
  hideLabel?: boolean;
  label?: ReactNode;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  presentation?: boolean;
  radioId?: string;
  size?: 'small' | 'xsmall';
  value: string;
}

const RadioButton = ({
  checked,
  description,
  disabled,
  error,
  helpText,
  hideLabel,
  label,
  name,
  onChange,
  presentation,
  radioId,
  size = 'small',
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
    helpText={helpText}
    hideLabel={hideLabel}
    inputId={radioId}
    label={label}
    name={name}
    onChange={onChange}
    presentation={presentation}
    size={size}
    type='radio'
    value={value}
  >
    <span className={classes.visibleButton}>
      <span className={classes.checkmark} />
    </span>
  </CheckboxRadioTemplate>
);

RadioButton.displayName = 'RadioButton';

export { RadioButton };
