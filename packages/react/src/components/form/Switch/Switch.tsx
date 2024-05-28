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
            `fds-switch`,
            `fds-switch--${size}`,
            inputProps.disabled && `fds-switch--disabled`,
            readOnly && `fds-switch--readonly`,
            className,
          )}
        >
          <input
            className={`fds-switch__input`}
            ref={ref}
            {...omit(['size', 'error'], rest)}
            {...inputProps}
          />

          <Label
            className={cl(
              `fds-switch__label`,
              position === 'right' && `fds-switch__label--right`,
            )}
            htmlFor={inputProps.id}
            size={size}
            weight='regular'
          >
            <span className={`fds-switch__track`}>
              <span className={`fds-switch__thumb`} />
            </span>
            {readOnly && (
              <PadlockLockedFillIcon
                aria-hidden
                className={`fds-switch__readonly__icon`}
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
                className={`fds-switch__description`}
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
