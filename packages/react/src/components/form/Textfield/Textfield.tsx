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
  label?: ReactNode;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  prefix?: string;
  sufix?: string;
  type?:
    | 'text'
    | 'password'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'month'
    | 'number'
    | 'search'
    | 'tel'
    | 'time'
    | 'url'
    | 'week';
  /**
   *  The characterLimit function calculates remaining characters.
   *  Provide a `label` function that takes count as parameter and returns a message.
   *  Use `srLabel` to describe `maxCount` for screen readers.
   */
  characterLimit?: CharacterLimitProps;
} & Omit<FormFieldProps, 'size'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Textfield = forwardRef<HTMLInputElement, TextfieldProps>(
  (props, ref) => {
    const {
      label,
      description,
      sufix,
      prefix,
      style,
      characterLimit,
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
    const characterLimitId = `charactercount-${useId()}`;
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
          classes.textfield,
          inputProps.disabled && classes.disabled,
          readOnly && classes.readonly,
          rest.className,
        )}
      >
        {label && (
          <Label
            className={classes.label}
            htmlFor={inputProps.id}
            size={size}
            weight='regular'
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
            className={classes.description}
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
              utilityClasses.focusable,
              prefix && classes.inputPrefix,
              sufix && classes.inputSufix,
            )}
            ref={ref}
            aria-describedby={describedBy}
            onChange={(e) => {
              inputProps?.onChange?.(e);
              setInputValue(e.target.value);
            }}
          />
          {sufix && (
            <Paragraph
              as='div'
              size={size}
              className={cn(classes.adornment, classes.sufix)}
              aria-hidden='true'
              short
            >
              {sufix}
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
