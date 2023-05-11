import type { HTMLAttributes, ForwardedRef, ChangeEvent } from 'react';
import React, { forwardRef, useState } from 'react';
import cn from 'classnames';
import type {
  NumericFormatProps,
  PatternFormatProps,
  NumberFormatValues,
  SourceInfo,
} from 'react-number-format';
import { NumericFormat, PatternFormat } from 'react-number-format';

import { isNumericFormat, isPatternFormat } from '../../utils';
import { InputWrapper } from '../_InputWrapper';
import type { ReadOnlyVariant_, CharLimit } from '../_InputWrapper';

export type TextFieldProps = {
  charLimit?: CharLimit;
  defaultValue?: string | number;
  formatting?: TextFieldFormatting;
  isValid?: boolean;
  label?: string;
  readOnly?: boolean | ReadOnlyVariant_;
  value?: string;
  disabled?: boolean;
  required?: boolean;
} & HTMLAttributes<HTMLInputElement>;

export type TextFieldFormatting = {
  align?: 'right' | 'center' | 'left';
  number?: NumericFormatProps | PatternFormatProps;
};

type ReplaceTargetValueWithUnformattedValueProps = {
  sourceInfo: SourceInfo;
  values: NumberFormatValues;
};

const replaceTargetValueWithUnformattedValue = ({
  values,
  sourceInfo,
}: ReplaceTargetValueWithUnformattedValueProps) => {
  (sourceInfo.event as React.ChangeEvent<HTMLInputElement>).target.value =
    values.value.trim();
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      onChange,
      isValid = true,
      disabled = false,
      readOnly = false,
      required = false,
      formatting,
      label,
      value,
      charLimit,
      ...rest
    }: TextFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [currentValue, setCurrentValue] = useState<string>(
      value ? `${value}` : '',
    );

    const handleNumberFormatChange = (
      values: NumberFormatValues,
      sourceInfo: SourceInfo,
    ): void => {
      if (sourceInfo.source === 'event' && onChange) {
        setCurrentValue(values.value.trim());
        replaceTargetValueWithUnformattedValue({
          values,
          sourceInfo,
        });
        onChange(sourceInfo.event as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const handleNativeInputChange = (
      event: ChangeEvent<HTMLInputElement>,
    ): void => {
      if (onChange) {
        onChange(event);
      }
      setCurrentValue(event.target.value || '');
    };

    return (
      <InputWrapper<HTMLInputElement>
        value={currentValue}
        isValid={isValid}
        disabled={disabled}
        readOnly={readOnly}
        label={label}
        inputId={id}
        charLimit={charLimit}
        inputRenderer={({ className, variant, inputId, describedBy }) => {
          const commonProps = {
            id: inputId,
            readOnly: Boolean(readOnly),
            disabled,
            required,
            className: cn(className, rest.className),
            style: {
              textAlign: formatting?.align,
              ...rest.style,
            },
          };

          if (formatting?.number && isNumericFormat(formatting.number)) {
            // Prefix starting with '-' causes problems, add a leading space
            if (
              formatting.number.prefix &&
              formatting.number.prefix[0] === '-'
            ) {
              formatting.number.prefix = ` ${formatting.number.prefix}`;
            }

            return (
              <NumericFormat
                {...commonProps}
                {...formatting.number}
                {...rest}
                data-testid={`${inputId}-formatted-number-${variant}`}
                onValueChange={handleNumberFormatChange}
                valueIsNumericString={true}
                aria-describedby={describedBy}
                getInputRef={ref}
              />
            );
          } else if (formatting?.number && isPatternFormat(formatting.number)) {
            return (
              <PatternFormat
                {...commonProps}
                {...formatting.number}
                {...rest}
                data-testid={`${inputId}-formatted-number-${variant}`}
                onValueChange={handleNumberFormatChange}
                valueIsNumericString={true}
                aria-describedby={describedBy}
                getInputRef={ref}
              />
            );
          } else {
            return (
              <input
                {...commonProps}
                {...rest}
                data-testid={`${inputId}-${variant}`}
                onChange={handleNativeInputChange}
                aria-describedby={describedBy}
                ref={ref}
              />
            );
          }
        }}
      />
    );
  },
);
