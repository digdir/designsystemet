/*
 * This is an internal component used for the Checkbox and RadioButton components,
 * as they have several similarities.
 */

import type { ChangeEventHandler, ReactNode } from 'react';
import { forwardRef, useId } from 'react';
import cl from 'clsx';
import { HelpText, type HelpTextProps } from '@digdir/designsystemet-react';

import utilityClasses from '../../../utilities/utility.module.css';

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

const SIZE_MAP: {
  [key in CheckboxRadioTemplateProps['size']]: HelpTextProps['size'];
} = {
  xsmall: 'small',
  small: 'medium',
};

export const CheckboxRadioTemplate = forwardRef<
  HTMLInputElement,
  CheckboxRadioTemplateProps
>(
  (
    {
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
    },
    ref,
  ) => {
    const randomId = useId();
    const finalInputId = inputId ?? 'input-' + randomId;
    const labelId = label ? `${finalInputId}-label` : undefined;
    const descriptionId = description
      ? `${finalInputId}-description`
      : undefined;
    const showLabel = label && !hideLabel;
    const shouldHaveClickableLabel =
      !presentation ||
      (typeof label !== 'object' && typeof description !== 'object');

    return (
      <Wrapper
        className={cl(
          classes.template,
          classes[size],
          !showLabel && classes.hiddenLabel,
          disabled ? classes.disabled : utilityClasses.focusable,
          className,
        )}
        htmlFor={finalInputId}
        isLabel={shouldHaveClickableLabel}
      >
        {!hideInput && (
          <Wrapper
            className={classes.inputWrapper}
            htmlFor={finalInputId}
            isLabel={!shouldHaveClickableLabel}
          >
            <input
              ref={ref}
              aria-describedby={descriptionId}
              aria-labelledby={label ? labelId : undefined}
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
        {(label || description) && (
          <span className={classes.labelAndDescription}>
            <span className={classes.labelAndHelpText}>
              {label && (
                <span
                  className={classes.label}
                  id={labelId}
                  style={{ display: showLabel ? 'inline' : 'none' }}
                >
                  {label}
                </span>
              )}
              {helpText && (
                <HelpText
                  size={SIZE_MAP[size]}
                  title={
                    typeof label === 'string' ? `Help text for ${label}` : ''
                  }
                >
                  {helpText}
                </HelpText>
              )}
            </span>
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
  },
);

interface WrapperProps {
  children: ReactNode;
  className: string;
  htmlFor?: string;
  isLabel: boolean;
}

const Wrapper = ({ children, className, htmlFor, isLabel }: WrapperProps) =>
  isLabel ? (
    <label
      className={className + ' ' + classes.clickable}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  ) : (
    <span className={className}>{children}</span>
  );
