import React, { forwardRef } from 'react';
import type { ForwardedRef, ReactNode, SelectHTMLAttributes } from 'react';
import cn from 'classnames';

import { InputWrapper } from '../../utilities/InputWrapper';

export type NativeSelectProps = {
  /** Instances of `option` */
  children?: ReactNode;

  /** Specifies whether the select box is disabled. */
  disabled?: boolean;

  /** Specifies whether the selected value is valid. */
  isValid?: boolean;

  /** Label that appears over the select box. */
  label?: string;

  /** Set to true to enable multiple selection. */
  multiple?: boolean;

  /** The ID of the `select` element. This will be generated if not provided. */
  id?: string;

  /** Defines the number of visible options. */
  size?: number;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    { children, disabled = false, id, isValid = true, label, ...selectProps },
    ref: ForwardedRef<HTMLSelectElement>,
  ) => (
    <InputWrapper
      disabled={disabled}
      inputId={id}
      isValid={isValid}
      inputRenderer={({ className, inputId }) => (
        <select
          disabled={disabled}
          id={inputId}
          ref={ref}
          {...selectProps}
          className={cn(className, selectProps.className)}
        >
          {children}
        </select>
      )}
      label={label}
    />
  ),
);
