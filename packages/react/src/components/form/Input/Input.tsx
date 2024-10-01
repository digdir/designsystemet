import { PadlockLockedFillIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId, useState } from 'react';

import { omit } from '../../../utilities';
import type { CharacterLimitProps } from '../CharacterCounter';
import type { FormFieldProps } from '../useFormField';

import { useInput } from './useInput';

export type InputProps = {
  /** Label */
  label?: ReactNode;
  /** Visually hides `label` and `description` (still available for screen readers)  */
  hideLabel?: boolean;
  /**
   * Changes field size and paddings
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
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
  /** Exposes the HTML `size` attribute.
   * @default 20
   */
  htmlSize?: number;
} & Omit<FormFieldProps, 'size'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

/** Text input field
 *
 * @example
 * ```tsx
 * <Input label="Input label">
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const {
      label,
      description,
      suffix,
      prefix,
      style,
      characterLimit,
      hideLabel,
      type = 'text',
      htmlSize = 20,
      className,
      ...rest
    } = props;

    const {
      inputProps,
      descriptionId,
      hasError,
      errorId,
      size = 'md',
      readOnly,
    } = useInput(props);

    const [inputValue, setInputValue] = useState(
      props.value || props.defaultValue,
    );
    const characterLimitId = `Input-charactercount-${useId()}`;
    const hasCharacterLimit = characterLimit != null;

    const describedBy =
      cl(
        inputProps['aria-describedby'],
        hasCharacterLimit && characterLimitId,
      ) || undefined;

    return (
      <input
        className={cl(
          `ds-input__input`,
          `ds-focus`,
          prefix && `ds-input__input--with-prefix`,
          suffix && `ds-input__input--with-suffix`,
        )}
        ref={ref}
        type={type}
        disabled={inputProps.disabled}
        aria-describedby={describedBy}
        size={htmlSize}
        {...omit(['size', 'error', 'errorId'], rest)}
        {...inputProps}
        onChange={(e) => {
          inputProps?.onChange?.(e);
          setInputValue(e.target.value);
        }}
      />
    );
  },
);

export const InputAdornments = forwardRef<HTMLInputElement, InputProps>(
  function InputAdornments() {
    return null;
  },
);
