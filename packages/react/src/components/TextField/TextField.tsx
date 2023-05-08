import React from 'react';
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
import type { ReadOnlyVariant_, CharLimitInformation } from '../_InputWrapper';

export interface TextFieldProps
  extends Omit<
    NumericFormatProps | PatternFormatProps,
    'readOnly' | 'value' | 'defaultValue'
  > {
  charLimitInformation?: CharLimitInformation;
  defaultValue?: string | number;
  formatting?: TextFieldFormatting;
  isValid?: boolean;
  label?: string;
  readOnly?: boolean | ReadOnlyVariant_;
  value?: string;
}

export interface TextFieldFormatting {
  align?: 'right' | 'center' | 'left';
  number?: NumericFormatProps | PatternFormatProps;
}

interface ReplaceTargetValueWithUnformattedValueProps {
  sourceInfo: SourceInfo;
  values: NumberFormatValues;
}

const replaceTargetValueWithUnformattedValue = ({
  values,
  sourceInfo,
}: ReplaceTargetValueWithUnformattedValueProps) => {
  (sourceInfo.event as React.ChangeEvent<HTMLInputElement>).target.value =
    values.value.trim();
};

const TextField = ({
  id,
  onChange,
  isValid = true,
  disabled = false,
  readOnly = false,
  required = false,
  formatting,
  label,
  charLimitInformation,
  ...rest
}: TextFieldProps) => {
  const handleNumberFormatChange = (
    values: NumberFormatValues,
    sourceInfo: SourceInfo,
  ) => {
    if (sourceInfo.source === 'event' && onChange) {
      replaceTargetValueWithUnformattedValue({
        values,
        sourceInfo,
      });
      onChange(sourceInfo.event as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <InputWrapper
      isValid={isValid}
      disabled={disabled}
      readOnly={readOnly}
      label={label}
      inputId={id}
      charLimitInformation={charLimitInformation}
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
          if (formatting.number.prefix && formatting.number.prefix[0] === '-') {
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
            />
          );
        } else {
          return (
            <input
              {...commonProps}
              {...rest}
              data-testid={`${inputId}-${variant}`}
              onChange={onChange}
              aria-describedby={describedBy}
            />
          );
        }
      }}
    />
  );
};

TextField.displayName = 'TextField';

export { TextField };
