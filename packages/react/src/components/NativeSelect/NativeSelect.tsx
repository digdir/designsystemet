import React, { forwardRef } from 'react';
import type { ForwardedRef, ReactNode, SelectHTMLAttributes } from 'react';
import cn from 'classnames';

import { Label, Paragraph } from '../Typography';

import classes from './NativeSelect.module.css';

export type NativeSelectProps = {
  /** Instances of `option` */
  children?: ReactNode;
  /**
   * Specifies whether the select box is disabled.
   * @default false
   * */
  disabled?: boolean;
  /** Specifies whether the selected value is valid.
   * @default true
   */
  isValid?: boolean;
  /**
   * Label that appears over the select box. */
  label?: string;
  /** Set to true to enable multiple selection. */
  multiple?: boolean;
  /** The ID of the `select` element. This will be generated if not provided. */
  id?: string;
  /**
   * Defines the number of visible options.
   * @default 'medium'
   * */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
} & SelectHTMLAttributes<HTMLSelectElement>;

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      children,
      disabled = false,
      id,
      isValid = true,
      label,
      size = 'medium',
      ...selectProps
    },
    ref: ForwardedRef<HTMLSelectElement>,
  ) => (
    <Paragraph>
      {label && (
        <Label
          weight='medium'
          htmlFor={id}
          className={cn(label && classes.label)}
        >
          <span>{label}</span>
        </Label>
      )}
      <select
        disabled={disabled}
        id={id}
        ref={ref}
        {...selectProps}
        className={cn(classes.input, classes[size], selectProps.className)}
      >
        {children}
      </select>
    </Paragraph>
  ),
);
