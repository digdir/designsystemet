import type { ReactNode, TextareaHTMLAttributes } from 'react';
import { useState, forwardRef } from 'react';
import cl from 'clsx';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utilities';
import { Label, Paragraph, ErrorMessage } from '../../Typography';
import type { FormFieldProps } from '../useFormField';
import type { CharacterLimitProps } from '../CharacterCounter';
import { CharacterCounter } from '../CharacterCounter';

import { useTextarea } from './useTextarea';
import classes from './Textarea.module.css';

export type TextareaProps = {
  /** Label */
  label?: ReactNode;
  /** Visually hides `label` and `description` (still available for screen readers)  */
  hideLabel?: boolean;
  /** Changes field size and paddings
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
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
} & Omit<FormFieldProps, 'size'> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Textarea field
 *
 * @example
 * ```tsx
 * <Textarea label="Textarea label">
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const { label, description, style, characterLimit, hideLabel, className, ...rest } = props;

  const { textareaProps, descriptionId, hasError, errorId, size = 'medium', readOnly } = useTextarea(props);

  const [value, setValue] = useState(props.defaultValue);
  const characterLimitId = `${textareaProps.id}-charactercount}`;
  const hasCharacterLimit = characterLimit != null;

  const describedBy = cl(textareaProps['aria-describedby'], hasCharacterLimit && characterLimitId) || undefined;

  return (
    <Paragraph
      asChild
      size={size}
    >
      <div
        style={style}
        className={cl(
          classes.formField,
          textareaProps.disabled && classes.disabled,
          readOnly && classes.readonly,
          hasError && classes.error,
          className,
        )}
      >
        {label && (
          <Label
            size={size}
            weight='medium'
            htmlFor={textareaProps.id}
            className={cl(classes.label, hideLabel && `fds-sr-only`)}
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
            asChild
            size={size}
          >
            <div
              id={descriptionId}
              className={cl(classes.description, hideLabel && `fds-sr-only`)}
            >
              {description}
            </div>
          </Paragraph>
        )}
        <textarea
          className={cl(classes.textarea, `fds-focus`, classes[size])}
          ref={ref}
          aria-describedby={describedBy}
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
          className={classes.errorMessage}
          id={errorId}
          aria-live='polite'
          aria-relevant='additions removals'
        >
          {hasError && <ErrorMessage size={size}>{props.error}</ErrorMessage>}
        </div>
      </div>
    </Paragraph>
  );
});

Textarea.displayName = 'Textarea';
