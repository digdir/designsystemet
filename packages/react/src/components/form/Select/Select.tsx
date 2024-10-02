import { PadlockLockedFillIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ForwardedRef, ReactNode, SelectHTMLAttributes } from 'react';

import { omit } from '../../../utilities';
import { Label } from '../../Label';
import { Paragraph } from '../../Paragraph';
import { ValidationMessage } from '../../ValidationMessage';

import { useSelect } from './useSelect';

export type SelectProps = {
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
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple'>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(props, ref: ForwardedRef<HTMLSelectElement>) {
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
      readOnly,
      size = 'md',
    } = useSelect(props);

    return (
      <Paragraph asChild size={size}>
        <div
          className={cl(
            'ds-select--container',
            readOnly && 'ds-select--readonly',
            error && 'ds-select--error',
          )}
        >
          {label && (
            <Label
              weight='medium'
              size={size}
              htmlFor={selectProps.id}
              className={cl('ds-select__label', hideLabel && 'ds-sr-only')}
            >
              {readOnly && (
                <PadlockLockedFillIcon
                  aria-hidden
                  className={'ds-select__readonly__icon'}
                />
              )}
              {label}
            </Label>
          )}
          {description && (
            <Paragraph asChild size={size}>
              <div
                id={descriptionId}
                className={cl(
                  `ds-select__description`,
                  hideLabel && `ds-sr-only`,
                )}
              >
                {description}
              </div>
            </Paragraph>
          )}
          <div className='ds-select__wrapper'>
            <select
              disabled={disabled}
              ref={ref}
              size={htmlSize}
              className={cl(
                'ds-select',
                `ds-select--${size}`,
                `ds-focus`,
                props.multiple && 'ds-select--multiple',
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
              className={'ds-select__error-message'}
              aria-live='polite'
              aria-relevant='additions removals'
            >
              <ValidationMessage size={size}>{error}</ValidationMessage>
            </div>
          )}
        </div>
      </Paragraph>
    );
  },
);
