import React, { forwardRef, useId, useState } from 'react';
import type { ChangeEvent, HTMLAttributes, ForwardedRef } from 'react';

import { InputWrapper } from '../_InputWrapper';
import type { ReadOnlyVariant_, CharLimit } from '../_InputWrapper';

import classes from './TextArea.module.css';

export type TextAreaProps = {
  /* Whether the textarea value is valid.*/
  isValid?: boolean;
  /*Whether the textarea is read-only*/
  readOnly?: boolean | ReadOnlyVariant_;
  /*The resize behavior of the text area.*/
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  /* The configuration for the character limit display. */
  charLimit?: CharLimit;
  /* Label for the textarea */
  label?: string;
  /* The value of the textarea */
  value?: string;
  /* Whether the textarea is disabled or not */
  disabled?: boolean;
} & HTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef(
  (
    {
      isValid = true,
      disabled = false,
      readOnly = false,
      resize = 'none',
      label,
      charLimit,
      value,
      onChange,
      ...rest
    }: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): JSX.Element => {
    const [currentInputValue, setCurrentInputValue] = useState<string>(
      value ? `${value}` : '',
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
      <InputWrapper<HTMLTextAreaElement>
        ref={ref}
        value={currentInputValue}
        disabled={disabled}
        inputId={textAreaId}
        charLimit={charLimit}
        inputRenderer={({ className, inputId, describedBy }) => {
          return (
            <textarea
              {...rest}
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
