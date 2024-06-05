import type { InputHTMLAttributes, ReactNode } from 'react';
import { useState, useId, forwardRef } from 'react';
import cl from 'clsx/lite';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utilities';
import { Label, Paragraph, ErrorMessage } from '../../Typography';
import type { FormFieldProps } from '../useFormField';
import type { CharacterLimitProps } from '../CharacterCounter';
import { CharacterCounter } from '../CharacterCounter';

import { useTextfield } from './useTextfield';

export type TextfieldProps = {
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
    } = useTextfield(props);

    const [inputValue, setInputValue] = useState(
      props.value || props.defaultValue,
    );
    const characterLimitId = `textfield-charactercount-${useId()}`;
    const hasCharacterLimit = characterLimit != null;

    const describedBy =
      cl(
        inputProps['aria-describedby'],
        hasCharacterLimit && characterLimitId,
      ) || undefined;

    return (
      <Paragraph
        asChild
        size={size}
      >
        <div
          style={style}
          className={cl(
            `fds-textfield`,
            `fds-textfield--${size}`,
            readOnly && `fds-textfield--readonly`,
            hasError && `fds-textfield--error`,
            className,
          )}
        >
          {label && (
            <Label
              size={size}
              weight='medium'
              htmlFor={inputProps.id}
              className={cl(`fds-textfield__label`, hideLabel && `fds-sr-only`)}
            >
              {readOnly && (
                <PadlockLockedFillIcon
                  aria-hidden
                  className='fds-textfield__readonly__icon'
                />
              )}
              <span>{label}</span>
            </Label>
          )}
          {description && (
            <Paragraph
              asChild
              size={size}
            >
              <div
                id={descriptionId}
                className={cl(
                  `fds-textfield__description`,
                  hideLabel && `fds-sr-only`,
                )}
              >
                {description}
              </div>
            </Paragraph>
          )}
          <div className='fds-textfield__field'>
            {prefix && (
              <Paragraph
                asChild
                size={size}
                variant='short'
              >
                <div
                  className={cl(
                    `fds-textfield__adornment`,
                    `fds-textfield__prefix`,
                  )}
                  aria-hidden='true'
                >
                  {prefix}
                </div>
              </Paragraph>
            )}
            <input
              className={cl(
                `fds-textfield__input`,
                `fds-focus`,
                prefix && `fds-textfield__input--with-prefix`,
                suffix && `fds-textfield__input--with-suffix`,
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
            {suffix && (
              <Paragraph
                asChild
                size={size}
                variant='short'
              >
                <div
                  className={cl(
                    `fds-textfield__adornment`,
                    `fds-textfield__suffix`,
                  )}
                  aria-hidden='true'
                >
                  {suffix}
                </div>
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
            className='fds-textfield__error-message'
            id={errorId}
            aria-live='polite'
            aria-relevant='additions removals'
          >
            {hasError && <ErrorMessage size={size}>{props.error}</ErrorMessage>}
          </div>
        </div>
      </Paragraph>
    );
  },
);

Textfield.displayName = 'Textfield';
