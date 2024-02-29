import type { ChangeEventHandler, ReactNode } from 'react';
import cl from 'clsx';

import { CheckboxRadioTemplate } from '../_CheckboxRadioTemplate';

import classes from './Checkbox.module.css';

export interface LegacyCheckboxProps {
  /**
   * An ID that will be applied to the ID attribute of the checkbox element.
   * It will be automatically generated to a random value if not set.
   */
  checkboxId?: string;

  /**
   * Set to `true` to disable the checkbox.
   * This is currently the only way to set the `checked` mode, as uncontrolled mode is not supported yet.
   */
  checked?: boolean;

  /** Set to `true` to apply compact styling, making the checkbox smaller. */
  compact?: boolean;

  /** The description of the checkbox. This will appear below the label. */
  description?: ReactNode;

  /** Set to `true` to disable the checkbox. */
  disabled?: boolean;

  /** Set to `true` to apply error styling to the checkbox. */
  error?: boolean;

  /** Set this to make a clickable help icon appear to the right for the label. The content will appear when the user clicks on it. */
  helpText?: ReactNode;

  /** Set to `true` to visually hide the label text, but still make it accessible to tools like screen readers. */
  hideLabel?: boolean;

  /** The label of the checkbox. */
  label?: ReactNode;

  /** The name of the checkbox. */
  name?: string;

  /**
   * A callback that will be called when the checkbox is toggled.
   * Use this function to get the current `checked` value.
   */
  onChange: ChangeEventHandler<HTMLInputElement>;

  /**
   * Set to `true` if this checkbox is a part of a preview and does not provide anything to the functionality of the application.
   * In this mode, the label text will not be clickable unless it is a plain text.
   * This allows having clickable elements inside the label text.
   */
  presentation?: boolean;

  /** Set to `true` to apply read-only mode. */
  readOnly?: boolean;
}
/**
 * @note Replaced by new {@link https://storybook.designsystemet.no/?path=/docs/felles-checkbox--docs Checkbox} component.
 */
const LegacyCheckbox = ({
  checkboxId,
  checked = false,
  compact = false,
  description,
  disabled = false,
  error = false,
  helpText,
  hideLabel,
  label,
  name,
  onChange,
  presentation = false,
  readOnly = false,
}: LegacyCheckboxProps) => (
  <CheckboxRadioTemplate
    checked={checked}
    className={cl(
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
    size={compact ? 'xsmall' : 'small'}
    type='checkbox'
  >
    <span className={classes.visibleBox}>
      <span className={classes.checkmark} />
    </span>
  </CheckboxRadioTemplate>
);

LegacyCheckbox.displayName = 'LegacyCheckbox';

export { LegacyCheckbox };
