import type { ForwardedRef, ChangeEvent } from 'react';
import { forwardRef, useState } from 'react';
import cl from 'clsx';
import type {
  NumericFormatProps,
  PatternFormatProps,
  NumberFormatValues,
  SourceInfo,
} from 'react-number-format';
import { NumericFormat, PatternFormat } from 'react-number-format';

import { isNumericFormat, isPatternFormat } from '../../../utilities';
import { InputWrapper } from '../../../utilities/InputWrapper';
import type {
  ReadOnlyVariant_,
  CharacterLimit,
} from '../../../utilities/InputWrapper';

export type LegacyTextFieldProps = {
  /**
   *  The characterLimit function calculates remaining characters.
   *  Provide a `label` function that takes count as parameter and returns a message.
   *  Use `srLabel` to describe `maxCount` for screen readers.
   */
  characterLimit?: CharacterLimit;

  /** The default value for the text field. */
  defaultValue?: string | number;

  /** The formatting options for the text field. */
  formatting?: LegacyTextFieldFormatting;

  /** Specifies whether the value of the text field is valid. */
  isValid?: boolean;

  /** The label for the text field. */
  label?: string;

  /** Whether the text field is read-only. */
  readOnly?: boolean | ReadOnlyVariant_;

  /** The value of the text field. */
  value?: string;

  /** Specifies whether the text field is disabled. */
  disabled?: boolean;

  /** Specifies whether the text field is required. */
  required?: boolean;

  /** Specifies the type of the text field. */
  type?:
    | 'text'
    | 'password'
    | 'color'
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
} & Omit<
  NumericFormatProps | PatternFormatProps,
  'readOnly' | 'value' | 'defaultValue' | 'type'
>; // Todo: We should extend the props of <input> here, but it's complex because of the number format implementation. We should move that out to a separate component first.

export type LegacyTextFieldFormatting = {
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
}: ReplaceTargetValueWithUnformattedValueProps): ChangeEvent<HTMLInputElement> => {
  const copiedEvent = {
    ...sourceInfo.event,
  } as ChangeEvent<HTMLInputElement>;

  return {
    ...copiedEvent,
    target: {
      ...copiedEvent.target,
      value: values.value.trim(),
    },
  };
};

/**
 *
 * @note
 * Replaced by new {@link https://storybook.designsystemet.no/?path=/docs/felles-textfield--docs Textfield} component.
 */
export const LegacyTextField = forwardRef<
  HTMLInputElement,
  LegacyTextFieldProps
>(
  (
    {
      id,
      onChange,
      isValid = true,
      disabled = false,
      readOnly = false,
      required = false,
      type = 'text',
      formatting,
      label,
      value,
      characterLimit,
      'aria-describedby': ariaDescribedBy,
      ...rest
    }: LegacyTextFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [currentValue, setCurrentValue] = useState<string>(
      value ? value.toString() : '',
    );

    const handleNumberFormatChange = (
      values: NumberFormatValues,
      sourceInfo: SourceInfo,
    ): void => {
      /* eslint-disable-next-line */
      if (sourceInfo.source === 'event' && onChange) {
        const parsedEvent = replaceTargetValueWithUnformattedValue({
          values,
          sourceInfo,
        });
        setCurrentValue(parsedEvent.target.value);
        onChange(parsedEvent);
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
      <InputWrapper
        value={currentValue}
        isValid={isValid}
        disabled={disabled}
        readOnly={readOnly}
        label={label}
        inputId={id}
        characterLimit={characterLimit}
        ariaDescribedBy={ariaDescribedBy}
        inputRenderer={({ className, variant, inputId, describedBy }) => {
          const commonProps = {
            id: inputId,
            readOnly: Boolean(readOnly),
            disabled,
            required,
            className: cl(className, rest.className),
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
                value={value}
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
                value={value}
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
                value={value}
                data-testid={`${inputId}-${variant}`}
                onChange={handleNativeInputChange}
                aria-describedby={describedBy}
                ref={ref}
                type={type}
              />
            );
          }
        }}
      />
    );
  },
);
