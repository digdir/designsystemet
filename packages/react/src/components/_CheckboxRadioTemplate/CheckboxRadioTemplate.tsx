/*
 * This is an internal component used for the Checkbox and RadioButton components,
 * as they have several similarities.
 */

import type { ChangeEventHandler, ReactNode } from 'react';
import React, { useId } from 'react';
import cn from 'classnames';

import { HelpText } from '../HelpText';

import classes from './CheckboxRadioTemplate.module.css';

export interface CheckboxRadioTemplateProps {
  checked?: boolean;
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  disabled?: boolean;
  helpText?: ReactNode;
  hideInput?: boolean;
  hideLabel?: boolean;
  inputId?: string;
  inputWrapperClassName?: string;
  label?: ReactNode;
  name?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  presentation?: boolean;
  size: 'small' | 'xsmall';
  type: 'checkbox' | 'radio';
  value?: string;
}

export const CheckboxRadioTemplate = ({
  checked,
  children,
  className,
  description,
  disabled,
  helpText,
  hideInput,
  hideLabel,
  inputId,
  label,
  name,
  onChange,
  presentation,
  size = 'small',
  type,
  value,
}: CheckboxRadioTemplateProps) => {
  const randomId = useId();
  const finalInputId = inputId ?? 'input-' + randomId;
  const labelId = label ? `${finalInputId}-label` : undefined;
  const descriptionId = description ? `${finalInputId}-description` : undefined;
  const showLabel = !!(label && !hideLabel);
  const shouldHaveClickableLabel =
    !presentation ||
    (typeof label !== 'object' && typeof description !== 'object');

  return (
    <Wrapper
      className={cn(
        classes.template,
        classes[size],
        disabled && classes.disabled,
        className,
      )}
      htmlFor={finalInputId}
      isLabel={shouldHaveClickableLabel}
      showLabel={showLabel}
    >
      {!hideInput && (
        <Wrapper
          className={classes.inputWrapper}
          htmlFor={finalInputId}
          isLabel={!shouldHaveClickableLabel}
          showLabel={showLabel}
        >
          <input
            aria-describedby={descriptionId}
            aria-label={
              !showLabel && typeof label === 'string' ? label : undefined
            }
            aria-labelledby={showLabel ? labelId : undefined}
            checked={checked ?? false}
            className={classes.input}
            disabled={disabled}
            id={finalInputId}
            name={name}
            onChange={disabled ? undefined : onChange}
            role={presentation ? 'presentation' : undefined}
            type={type}
            value={value}
          />
          <span className={classes.visibleBox}>{children}</span>
        </Wrapper>
      )}
      {(showLabel || description) && (
        <span className={classes.labelAndDescription}>
          {showLabel && (
            <span className={classes.labelAndHelpText}>
              <span
                className={classes.label}
                id={labelId}
              >
                {label}
              </span>
              {helpText && (
                <HelpText
                  size={size}
                  title={
                    typeof label === 'string' ? `Help text for ${label}` : ''
                  }
                >
                  {helpText}
                </HelpText>
              )}
            </span>
          )}
          {description && (
            <span
              className={classes.description}
              id={descriptionId}
            >
              {description}
            </span>
          )}
        </span>
      )}
    </Wrapper>
  );
};

interface WrapperProps {
  children: ReactNode;
  className: string;
  htmlFor?: string;
  isLabel: boolean;
  showLabel: boolean;
}

const Wrapper = ({
  children,
  className,
  htmlFor,
  isLabel,
  showLabel,
}: WrapperProps) =>
  isLabel && showLabel ? (
    <label
      className={className + ' ' + classes.clickable}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  ) : (
    <span className={className}>{children}</span>
  );
