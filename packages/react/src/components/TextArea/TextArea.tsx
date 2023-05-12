import React, { forwardRef, useId, useState } from 'react';
import type { ChangeEvent, ForwardedRef, TextareaHTMLAttributes } from 'react';

import { InputWrapper } from '../_InputWrapper';
import type { ReadOnlyVariant_, CharacterLimit } from '../_InputWrapper';

import classes from './TextArea.module.css';

export type TextAreaProps = {
  /* Whether the textarea value is valid.*/
  isValid?: boolean;
  /*Whether the textarea is read-only*/
  readOnly?: boolean | ReadOnlyVariant_;
  /*The resize behavior of the text area.*/
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  /* The configuration for the character limit display. */
  characterLimit?: CharacterLimit;
  /* Label for the textarea */
  label?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'readOnly'>;
export const TextArea = forwardRef(
  (
    {
      isValid = true,
      disabled = false,
      readOnly = false,
      resize = 'none',
      label,
      characterLimit,
      value,
      onChange,
      ...rest
    }: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): JSX.Element => {
    const [currentInputValue, setCurrentInputValue] = useState<string>(
      value ? value.toString() : '',
    );
    const generatedTextareaId = useId();
    const textAreaId = rest.id ?? generatedTextareaId;

    const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
      setCurrentInputValue(event.target.value);

      if (onChange) {
        onChange(event);
      }
    };

    return (
      <InputWrapper
        value={currentInputValue}
        disabled={disabled}
        inputId={textAreaId}
        characterLimit={characterLimit}
        inputRenderer={({ className, inputId, describedBy }) => {
          return (
            <textarea
              {...rest}
              ref={ref}
              value={value}
              onChange={handleOnChange}
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
        isValid={isValid}
        label={label}
        readOnly={readOnly}
      />
    );
  },
);
