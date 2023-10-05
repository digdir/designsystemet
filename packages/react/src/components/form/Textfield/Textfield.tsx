import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { useState, useId, forwardRef } from 'react';
import cn from 'classnames';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utils';
import { Label, Paragraph, ErrorMessage } from '../../Typography';
import type { FormFieldProps } from '../useFormField';
import type { CharacterLimitProps } from '../CharacterCounter';
import { CharacterCounter } from '../CharacterCounter';

import { useTextfield } from './useTextfield';
import classes from './Textfield.module.css';
import utilityClasses from './../../../utils/utility.module.css';

export type TextfieldProps = {
  /** Label */
  label?: ReactNode;
  /** Visually hides `label` and `description` (still available for screen readers)  */
  hideLabel?: boolean;
  /** Changes field size and paddings */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Prefix for field. */
  prefix?: string;
  /** Suffix for field. */
  suffix?: string;
  /** Supported `input` types */
  type?:
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';
  /**
   *  The characterLimit function calculates remaining characters based on `maxCount`
   *
   *  Provide a `label` function that takes count as parameter and returns a message.
   *
   *  Use `srLabel` to describe `maxCount` for screen readers.
   *
   *  Defaults to Norwegian if no labels are provided.
   */
  characterLimit?: CharacterLimitProps;
} & Omit<FormFieldProps, 'size'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

/** Text input field
 *
 * @example
 * ```tsx
 * <Textfield label="Textfield label">
 * ```
 */
export const Textfield = forwardRef<HTMLInputElement, TextfieldProps>(
  (props, ref) => {
    const {
      label,
      description,
      suffix,
      prefix,
      style,
      characterLimit,
      hideLabel,
      type = 'text',
      ...rest
    } = props;

    const {
      inputProps,
      descriptionId,
      hasError,
      errorId,
      size = 'medium',
      readOnly,
    } = useTextfield(props);

    const [inputValue, setInputValue] = useState(props.defaultValue);
    const characterLimitId = `textfield-charactercount-${useId()}`;
    const hasCharacterLimit = characterLimit != null;

    const describedBy = cn(
      inputProps['aria-describedby'],
      hasCharacterLimit && characterLimitId,
    );

    return (
      <Paragraph
        as='div'
        size={size}
        style={style}
        className={cn(
          classes.formField,
          inputProps.disabled && classes.disabled,
          readOnly && classes.readonly,
          rest.className,
        )}
      >
        {label && (
          <Label
            size={size}
            weight='medium'
            htmlFor={inputProps.id}
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
            <span>{label}</span>
          </Label>
        )}
        {description && (
          <Paragraph
            id={descriptionId}
            as='div'
            size={size}
            className={cn(
              classes.description,
              hideLabel && utilityClasses.visuallyHidden,
            )}
          >
            {description}
          </Paragraph>
        )}
        <div className={cn(classes.field, hasError && classes.error)}>
          {prefix && (
            <Paragraph
              as='div'
              size={size}
              className={cn(classes.adornment, classes.prefix)}
              aria-hidden='true'
              short
            >
              {prefix}
            </Paragraph>
          )}
          <input
            {...omit(['size', 'error', 'errorId'], rest)}
            {...inputProps}
            className={cn(
              classes.input,
              classes[size],
              utilityClasses.focusable,
              prefix && classes.inputPrefix,
              suffix && classes.inputSuffix,
            )}
            ref={ref}
            type={type}
            aria-describedby={describedBy}
            onChange={(e) => {
              inputProps?.onChange?.(e);
              setInputValue(e.target.value);
            }}
          />
          {suffix && (
            <Paragraph
              as='div'
              size={size}
              className={cn(classes.adornment, classes.suffix)}
              aria-hidden='true'
              short
            >
              {suffix}
            </Paragraph>
          )}
        </div>
        {hasCharacterLimit && (
          <CharacterCounter
            size={size}
            value={inputValue ? inputValue.toString() : ''}
            id={characterLimitId}
            {...characterLimit}
          />
        )}
        <div
          className={classes.errorMessage}
          id={errorId}
          aria-live='polite'
          aria-relevant='additions removals'
        >
          {hasError && <ErrorMessage size={size}>{props.error}</ErrorMessage>}
        </div>
      </Paragraph>
    );
  },
);
