import type { ChangeEventHandler, ReactNode } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';

import { CheckboxRadioTemplate } from '../_CheckboxRadioTemplate';

import classes from './RadioButton.module.css';

export interface LegacyRadioButtonProps {
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

/**
 *
 * @note
 * Replaced by new {@link https://storybook.designsystemet.no/?path=/docs/komponenter-radio--docs Radio} component.
 */
const LegacyRadioButton = forwardRef<HTMLInputElement, LegacyRadioButtonProps>(
  (
    {
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
    },
    ref,
  ) => (
    <CheckboxRadioTemplate
      checked={checked}
      className={cl(
        classes.radio,
        classes[size],
        checked && classes.checked,
        error && classes.error,
        disabled && classes.disabled,
      )}
      ref={ref}
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
  ),
);

LegacyRadioButton.displayName = 'LegacyRadioButton';

export { LegacyRadioButton };
