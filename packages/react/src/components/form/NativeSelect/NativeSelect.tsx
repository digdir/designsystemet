import { forwardRef } from 'react';
import type { ForwardedRef, ReactNode, SelectHTMLAttributes } from 'react';
import cl from 'clsx/lite';
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
  /**
   * Description for select
   */
  description?: ReactNode;
  /** Set to true to enable multiple selection. */
  multiple?: boolean;
  /**
   * Defines the size of the select.
   * @default md
   **/
  size?: 'sm' | 'md' | 'lg';
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
      description,
      hideLabel = false,
      error,
      className,
      htmlSize = 0,
      ...rest
    } = props;

    const {
      selectProps,
      descriptionId,
      errorId,
      readOnly = false,
      size = 'md',
    } = useNativeSelect(props);

    return (
      <Paragraph
        asChild
        size={size}
      >
        <div
          className={cl(
            'ds-native-select--container',
            readOnly && 'ds-native-select--readonly',
            error && 'ds-native-select--error',
          )}
        >
          {label && (
            <Label
              weight='medium'
              size={size}
              htmlFor={selectProps.id}
              className={cl(
                'ds-native-select__label',
                hideLabel && 'ds-sr-only',
              )}
            >
              {readOnly && (
                <PadlockLockedFillIcon
                  aria-hidden
                  className={'ds-native-select__readonly__icon'}
                />
              )}
              {label}
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
                  `ds-native-select__description`,
                  hideLabel && `ds-sr-only`,
                )}
              >
                {description}
              </div>
            </Paragraph>
          )}
          <div className='ds-native-select__wrapper'>
            <select
              disabled={disabled || readOnly}
              ref={ref}
              size={htmlSize}
              className={cl(
                'ds-native-select',
                `ds-native-select--${size}`,
                `ds-focus`,
                props.multiple && 'ds-native-select--multiple',
                className,
              )}
              {...omit(['size', 'error', 'errorId'], rest)}
              {...omit(['readOnly', 'disabled'], selectProps)}
            >
              {children}
            </select>
          </div>

          {error && (
            <div
              id={errorId}
              className={'ds-native-select__error-message'}
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
