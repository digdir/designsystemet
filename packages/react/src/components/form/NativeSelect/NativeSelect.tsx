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
   * Label that appears over the select box. */
  label?: string;
  /**
   * Visually hides `label` and `description` (still available for screen readers)
   * @default false
   * */
  hideLabel?: boolean;
  /** Set to true to enable multiple selection. */
  multiple?: boolean;
  /**
   * Defines the size of the select.
   * @default medium
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
      selectProps,
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
            size={size}
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
          className={cn(
            classes.select,
            classes[size],
            utilityClasses.focusable,
            className,
          )}
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
