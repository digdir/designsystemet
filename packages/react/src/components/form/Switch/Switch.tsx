import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import { useSwitch } from './useSwitch';

export type SwitchProps = {
  /** Switch label */
  children?: ReactNode;
  /** Value of the `input` element */
  value?: string;
  /** Position of switch around the label
   * @default left
   */
  position?: 'left' | 'right';
} & Omit<FormFieldProps, 'error' | 'errorId' | 'id'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (props, ref) => {
    const {
      children,
      description,
      position = 'left',
      className,
      ...rest
    } = props;
    const {
      inputProps,
      descriptionId,
      size = 'md',
      readOnly,
    } = useSwitch(props);

    return (
      <Paragraph
        asChild
        size={size}
      >
        <div
          className={cl(
            `ds-switch`,
            `ds-switch--${size}`,
            inputProps.disabled && `ds-switch--disabled`,
            readOnly && `ds-switch--readonly`,
            className,
          )}
        >
          <input
            className={`ds-switch__input`}
            disabled={inputProps.disabled}
            ref={ref}
            {...omit(['size', 'error'], rest)}
            {...inputProps}
          />

          <Label
            className={cl(
              `ds-switch__label`,
              'ds-font-weight--regular',
              position === 'right' && `ds-switch__label--right`,
            )}
            htmlFor={inputProps.id}
            size={size}
            weight='regular'
          >
            <span className={`ds-switch__track`}>
              <span className={`ds-switch__thumb`} />
            </span>
            {readOnly && (
              <PadlockLockedFillIcon
                aria-hidden
                className={`ds-switch__readonly__icon`}
              />
            )}
            {children && <span>{children}</span>}
          </Label>
          {description && (
            <Paragraph
              asChild
              size={size}
            >
              <div
                id={descriptionId}
                className={`ds-switch__description`}
              >
                {description}
              </div>
            </Paragraph>
          )}
        </div>
      </Paragraph>
    );
  },
);

Switch.displayName = 'Switch';
