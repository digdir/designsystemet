import React, { forwardRef } from 'react';
import type { ForwardedRef, ReactNode, SelectHTMLAttributes } from 'react';
import cn from 'classnames';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utils';
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
   * Defines the size of the select.
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
    const {
      children,
      disabled = false,
      label,
      hideLabel = false,
      error,
      className,
      ...rest
    } = props;

    const {
      inputProps: selectProps,
      errorId,
      readOnly = false,
      size = 'medium',
    } = useNativeSelect(props);

    return (
      <Paragraph
        as='div'
        size={size}
        className={cn(
          classes.formField,
          disabled && classes.disabled,
          readOnly && classes.readOnly,
          error && classes.error,
        )}
      >
        {label && (
          <Label
            weight='medium'
            htmlFor={selectProps.id}
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
          {...omit(['size', 'error', 'errorId'], rest)}
          {...selectProps}
          disabled={disabled || readOnly}
          ref={ref}
          className={cn(classes.input, classes[size], className)}
        >
          {children}
        </select>
        {error && (
          <div
            id={errorId}
            className={classes.errorMessage}
            aria-live='polite'
            aria-relevant='additions removals'
          >
            <ErrorMessage size={size}>{error}</ErrorMessage>
          </div>
        )}
      </Paragraph>
    );
  },
);
