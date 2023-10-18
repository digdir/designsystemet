import React, { forwardRef, useId } from 'react';
import type { ForwardedRef, ReactNode, SelectHTMLAttributes } from 'react';
import cn from 'classnames';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { ErrorMessage, Label, Paragraph } from '../../Typography';

import classes from './NativeSelect.module.css';
import utilityClasses from './../../../utils/utility.module.css';
import { useNativeSelect } from './useNativeSelect';

export type NativeSelectProps = {
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
  /**
   * Visually hides `label` and `description` (still available for screen readers)
   * @default false
   * */
  hideLabel?: boolean;
  /** Set to true to enable multiple selection. */
  multiple?: boolean;
  /** The ID of the `select` element. This will be generated if not provided. */
  id?: string;
  /**
   * Defines the number of visible options.
   * @default 'medium'
   * */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Error message for form field */
  error?: ReactNode;
  /** Defines if the select is readOnly
   * @default false
   */
  readOnly?: boolean;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (props, ref: ForwardedRef<HTMLSelectElement>) => {
    const randomInputId = useId();

    const {
      children,
      disabled = false,
      id,
      label,
      hideLabel = false,
      error,
      ...rest
    } = props;

    const {
      inputProps: selectProps,
      descriptionId,
      hasError,
      errorId,
      readOnly = false,
      size = 'medium',
    } = useNativeSelect(props);

    return (
      <Paragraph
        className={cn(
          disabled && classes.disabled,
          readOnly && classes.readOnly,
          error && classes.error,
        )}
      >
        {label && (
          <Label
            for={id ? id : randomInputId}
            weight='medium'
            htmlFor={id}
            className={cn(
              classes.label,
              hideLabel && utilityClasses.visuallyHidden,
            )}
          >
            {readOnly && (
              <PadlockLockedFillIcon
                aria-hidden
                className={classes.padlock}
              />
            )}
            {label}
          </Label>
        )}
        <select
          disabled={disabled || readOnly}
          id={id ? id : randomInputId}
          ref={ref}
          {...selectProps}
          className={cn(classes.input, classes[size], selectProps.className)}
        >
          {children}
        </select>
        <div
          className={classes.errorMessage}
          aria-live='polite'
          aria-relevant='additions removals'
        >
          {error && <ErrorMessage size={size}>{error}</ErrorMessage>}
        </div>
      </Paragraph>
    );
  },
);
