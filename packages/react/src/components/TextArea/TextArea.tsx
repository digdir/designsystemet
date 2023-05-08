import React, { useId } from 'react';
import type { HTMLProps } from 'react';

import { InputWrapper } from '../_InputWrapper';
import type { ReadOnlyVariant_, CharLimitInformation } from '../_InputWrapper';

import classes from './TextArea.module.css';

/**
 * Renders a text area input with an optional character limit display and label.
 *
 * @param {Object} props - The component props.
 * @param {boolean} [props.isValid=true] - Whether the input value is valid.
 * @param {boolean|ReadOnlyVariant_} [props.readOnly=false] - Whether the input is read-only
 * @param {'none'|'both'|'horizontal'|'vertical'} [props.resize='none'] - The resize behavior of the text area.
 * @param {CharLimitInformation} [props.charLimitInformation] - The configuration for the character limit display.
 * @param {string} [props.label] - The label for the input.
 * @param {boolean} [props.disabled=false] - Whether the input is disabled.
 * @returns {JSX.Element} The rendered component.
 *
 * @typedef {Object} CharLimitInformation - The configuration for the character limit display.
 * @property {boolean} hasExceededCharLimit - Whether the character limit has been exceeded.
 * @property {string} screenReaderMaxCharDescription - A description of the maximum allowed character count, used for screen readers.
 * @property {string} remainingCharLimitMessage - The message to display with the remaining character count.
 */

export type TextAreaProps = {
  isValid?: boolean;
  readOnly?: boolean | ReadOnlyVariant_;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  charLimitInformation?: CharLimitInformation;
} & HTMLProps<HTMLTextAreaElement>;

export const TextArea = ({
  charLimitInformation,
  isValid = true,
  disabled = false,
  readOnly = false,
  resize = 'none',
  label,
  ...rest
}: TextAreaProps): JSX.Element => {
  const generatedTextareaId = useId();
  const textAreaId = rest.id ?? generatedTextareaId;
  return (
    <InputWrapper
      disabled={disabled}
      inputId={textAreaId}
      charLimitInformation={charLimitInformation}
      inputRenderer={({ className, inputId, describedBy }) => {
        return (
          <textarea
            {...rest}
            id={inputId}
            aria-describedby={describedBy}
            disabled={disabled}
            readOnly={Boolean(readOnly)}
            className={[
              className,
              classes.textArea,
              classes[`resize-${resize}`],
            ].join(' ')}
          />
        );
      }}
      isValid={charLimitInformation?.hasExceededCharLimit ? false : isValid}
      label={label}
      readOnly={readOnly}
    />
  );
};
