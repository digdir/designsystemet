import { forwardRef } from 'react';
import type { ForwardedRef, ReactNode, SelectHTMLAttributes } from 'react';
import cl from 'clsx';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utilities';
import { ErrorMessage, Label, Paragraph } from '../../Typography';

import classes from './NativeSelect.module.css';
import { useNativeSelect } from './useNativeSelect';

export type NativeSelectProps = {
  /**
   * Label that appears over the select box. */
  label?: string;
  /**
   * Visually hides `label` and `description` (still available for screen readers)
   * @default false
   * */
  hideLabel?: boolean;
  /** Set to true to enable multiple selection. */
  multiple?: boolean;
  /**
   * Defines the size of the select.
   * @default medium
   * */
  size?: 'small' | 'medium' | 'large';
  /** Error message for form field */
  error?: ReactNode;
  /** Defines if the select is readOnly
   * @default false
   */
  readOnly?: boolean;
  /** Exposes the HTML `size` attribute.
   * @default 0
   */
  htmlSize?: number;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (props, ref: ForwardedRef<HTMLSelectElement>) => {
    const {
      children,
      disabled = false,
      label,
      hideLabel = false,
      error,
      className,
      htmlSize = 0,
      ...rest
    } = props;

    const {
      selectProps,
      errorId,
      readOnly = false,
      size = 'medium',
    } = useNativeSelect(props);

    return (
      <Paragraph
        asChild
        size={size}
      >
        <div
          className={cl(
            classes.formField,
            disabled && classes.disabled,
            readOnly && classes.readOnly,
            error && classes.error,
          )}
        >
          {label && (
            <Label
              weight='medium'
              size={size}
              htmlFor={selectProps.id}
              className={cl(
                classes.label,
                hideLabel && 'fds-utilities--visually-hidden',
              )}
            >
              {readOnly && (
                <PadlockLockedFillIcon
                  aria-hidden
                  className={classes.padlock}
                />
              )}
              {label}
            </Label>
          )}

          <select
            disabled={disabled || readOnly}
            ref={ref}
            size={htmlSize}
            className={cl(
              classes.select,
              classes[size],
              `fds-utilities--focusable`,
              props.multiple && classes.multiple,
              className,
            )}
            {...omit(['size', 'error', 'errorId'], rest)}
            {...omit(['readOnly', 'disabled'], selectProps)}
          >
            {children}
          </select>

          {error && (
            <div
              id={errorId}
              className={classes.errorMessage}
              aria-live='polite'
              aria-relevant='additions removals'
            >
              <ErrorMessage size={size}>{error}</ErrorMessage>
            </div>
          )}
        </div>
      </Paragraph>
    );
  },
);

NativeSelect.displayName = 'NativeSelect';
