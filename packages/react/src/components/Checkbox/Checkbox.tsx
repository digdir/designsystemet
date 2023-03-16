import type { ChangeEventHandler, ReactNode } from 'react';
import React from 'react';
import cn from 'classnames';

import {
  CheckboxRadioTemplate,
  CheckboxRadioTemplateSize,
} from '../_CheckboxRadioTemplate';

import classes from './Checkbox.module.css';

export interface CheckboxProps {
  checkboxId?: string;
  checked?: boolean;
  compact?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  helpText?: ReactNode;
  hideLabel?: boolean;
  label?: ReactNode;
  name?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  presentation?: boolean;
  readOnly?: boolean;
}

const Checkbox = ({
  checkboxId,
  checked,
  compact,
  description,
  disabled,
  error,
  helpText,
  hideLabel,
  label,
  name,
  onChange,
  presentation,
  readOnly,
}: CheckboxProps) => (
  <CheckboxRadioTemplate
    checked={checked}
    className={cn(
      classes.checkbox,
      checked && classes.checked,
      error && classes.error,
      disabled && classes.disabled,
      compact && classes.compact,
      readOnly && classes.readOnly,
    )}
    description={description}
    disabled={disabled}
    helpText={helpText}
    hideInput={readOnly}
    hideLabel={hideLabel}
    inputId={checkboxId}
    label={label}
    name={name}
    onChange={onChange}
    presentation={presentation}
    size={
      compact
        ? CheckboxRadioTemplateSize.Xsmall
        : CheckboxRadioTemplateSize.Small
    }
    type='checkbox'
  >
    <span className={classes.visibleBox}>
      <span className={classes.checkmark} />
    </span>
  </CheckboxRadioTemplate>
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
