import { forwardRef, useId, useState } from 'react';
import type { ChangeEvent, ForwardedRef, TextareaHTMLAttributes } from 'react';

import { InputWrapper } from '../../../utilities/InputWrapper';
import type {
  ReadOnlyVariant_,
  CharacterLimit,
} from '../../../utilities/InputWrapper';

import classes from './TextArea.module.css';

export type LegacyTextAreaProps = {
  /** Whether the textarea value is valid. */
  isValid?: boolean;
  /** Whether the textarea is read-only. */
  readOnly?: boolean | ReadOnlyVariant_;
  /** The resize behavior of the text area. */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  /**
   *  The characterLimit function calculates remaining characters.
   *  Provide a `label` function that takes count as parameter and returns a message.
   *  Use `srLabel` to describe `maxCount` for screen readers.
   */
  characterLimit?: CharacterLimit;
  /** Label for the textarea. */
  label?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'readOnly'>;

/**
 *
 * @note
 * Replaced by new {@link https://storybook.designsystemet.no/?path=/docs/komponenter-textarea--docs Textarea} component.
 */
export const LegacyTextArea = forwardRef(
  (
    {
      isValid = true,
      disabled = false,
      readOnly = false,
      resize = 'none',
      label,
      characterLimit,
      value,
      onChange,
      'aria-describedby': ariaDescribedBy,
      ...rest
    }: LegacyTextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): JSX.Element => {
    const [currentInputValue, setCurrentInputValue] = useState<string>(
      value ? value.toString() : '',
    );
    const generatedTextareaId = useId();
    const textAreaId = rest.id ?? generatedTextareaId;

    const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
      setCurrentInputValue(event.target.value);

      if (onChange) {
        onChange(event);
      }
    };

    return (
      <InputWrapper
        value={currentInputValue}
        disabled={disabled}
        inputId={textAreaId}
        characterLimit={characterLimit}
        ariaDescribedBy={ariaDescribedBy}
        inputRenderer={({ className, inputId, describedBy }) => {
          return (
            <textarea
              {...rest}
              ref={ref}
              value={value}
              onChange={handleOnChange}
              id={inputId}
              aria-describedby={describedBy}
              disabled={disabled}
              readOnly={Boolean(readOnly)}
              className={[
                className,
                classes.textArea,
                classes[`resize-${resize}`],
              ].join(' ')}
            />
          );
        }}
        isValid={isValid}
        label={label}
        readOnly={readOnly}
      />
    );
  },
);
