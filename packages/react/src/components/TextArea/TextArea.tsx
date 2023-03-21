import type { HTMLProps } from 'react';
import React from 'react';

import { InputWrapper } from '../_InputWrapper';
import type { ReadOnlyVariant_ } from '../_InputWrapper';

import classes from './TextArea.module.css';

export interface TextAreaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, 'readOnly' | 'className'> {
  isValid?: boolean;
  readOnly?: boolean | ReadOnlyVariant_;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const TextArea = ({
  isValid = true,
  disabled = false,
  readOnly = false,
  resize = 'none',
  label,
  ...rest
}: TextAreaProps) => (
  <InputWrapper
    disabled={disabled}
    inputId={rest.id}
    inputRenderer={({ className, inputId }) => {
      return (
        <textarea
          {...rest}
          id={inputId}
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

TextArea.displayName = 'TextArea';

export { TextArea };
