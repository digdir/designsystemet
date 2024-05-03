import { forwardRef } from 'react';
import type { ForwardedRef, ReactNode, SelectHTMLAttributes } from 'react';
import cl from 'clsx';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utilities';
import { ErrorMessage, Label, Paragraph } from '../../Typography';

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
            'fds-native-select--container',
            disabled && 'fds-native-select--disabled',
            readOnly && 'fds-native-select--readonly',
            error && 'fds-native-select--error',
          )}
        >
          {label && (
            <Label
              weight='medium'
              size={size}
              htmlFor={selectProps.id}
              className={cl(
                'fds-native-select__label',
                hideLabel && 'fds-sr-only',
              )}
            >
              {readOnly && (
                <PadlockLockedFillIcon
                  aria-hidden
                  className={'fds-native-select__readonly__icon'}
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
              'fds-native-select',
              `fds-native-select--${size}`,
              `fds-focus`,
              props.multiple && 'fds-native-select--multiple',
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
              className={'fds-native-select__error-message'}
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
