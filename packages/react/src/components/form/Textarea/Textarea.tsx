import type { ReactNode, TextareaHTMLAttributes } from 'react';
import { useState, forwardRef } from 'react';
import cl from 'clsx/lite';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utilities';
import { Label, Paragraph, ErrorMessage } from '../../Typography';
import type { FormFieldProps } from '../useFormField';
import type { CharacterLimitProps } from '../CharacterCounter';
import { CharacterCounter } from '../CharacterCounter';

import { useTextarea } from './useTextarea';

export type TextareaProps = {
  /** Label */
  label?: ReactNode;
  /** Visually hides `label` and `description` (still available for screen readers)  */
  hideLabel?: boolean;
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
} & FormFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Textarea field
 *
 * @example
 * ```tsx
 * <Textarea label="Textarea label">
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      label,
      description,
      style,
      characterLimit,
      hideLabel,
      className,
      ...rest
    } = props;

    const {
      textareaProps,
      descriptionId,
      hasError,
      errorId,
      size = 'md',
      readOnly,
    } = useTextarea(props);

    const [value, setValue] = useState(props.defaultValue);
    const characterLimitId = `${textareaProps.id}-charactercount}`;
    const hasCharacterLimit = characterLimit != null;

    const describedBy =
      cl(
        textareaProps['aria-describedby'],
        hasCharacterLimit && characterLimitId,
      ) || undefined;

    return (
      <Paragraph asChild size={size}>
        <div
          style={style}
          className={cl(
            'ds-textarea',
            `ds-textarea--${size}`,
            hasError && `ds-textarea--error`,
            className,
          )}
        >
          {label && (
            <Label
              size={size}
              weight='medium'
              htmlFor={textareaProps.id}
              className={cl('ds-textarea__label', hideLabel && `ds-sr-only`)}
            >
              {readOnly && (
                <PadlockLockedFillIcon
                  aria-hidden
                  className='ds-textarea__readonly-icon'
                />
              )}
              <span>{label}</span>
            </Label>
          )}
          {description && (
            <Paragraph asChild size={size}>
              <div
                id={descriptionId}
                className={cl(
                  'ds-textarea__description',
                  hideLabel && `ds-sr-only`,
                )}
              >
                {description}
              </div>
            </Paragraph>
          )}
          <textarea
            className={cl('ds-textarea__input', `ds-focus`)}
            ref={ref}
            aria-describedby={describedBy}
            disabled={textareaProps.disabled}
            readOnly={readOnly}
            {...omit(['size', 'error', 'errorId'], rest)}
            {...textareaProps}
            onChange={(e) => {
              textareaProps?.onChange?.(e);
              setValue(e.target.value);
            }}
          />
          {hasCharacterLimit && (
            <CharacterCounter
              size={size}
              value={value ? value.toString() : ''}
              id={characterLimitId}
              {...characterLimit}
            />
          )}
          <div
            className='ds-textarea__error-message'
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

Textarea.displayName = 'Textarea';
