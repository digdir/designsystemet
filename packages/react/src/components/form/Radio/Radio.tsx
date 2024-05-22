import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import { useRadio } from './useRadio';

export type RadioProps = {
  /** Radio label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const { children, description, className, style, ...rest } = props;
  const {
    inputProps,
    descriptionId,
    hasError,
    size = 'md',
    readOnly,
  } = useRadio(props);

  return (
    <Paragraph
      asChild
      size={size}
    >
      <div
        className={cl(
          'fds-radio',
          `fds-radio--${size}`,
          inputProps.disabled && `fds-radio--disabled`,
          hasError && `fds-radio--error`,
          readOnly && `fds-radio--readonly`,
          className,
        )}
        style={style}
      >
        <input
          className={'fds-radio__input'}
          ref={ref}
          {...omit(['size', 'error'], rest)}
          {...inputProps}
        />
        {children && (
          <>
            <Label
              className={'fds-radio__label'}
              htmlFor={inputProps.id}
              size={size}
              weight='regular'
            >
              <span>{children}</span>
            </Label>
            {description && (
              <Paragraph
                asChild
                size={size}
              >
                <div
                  id={descriptionId}
                  className={'fds-radio__description'}
                >
                  {description}
                </div>
              </Paragraph>
            )}
          </>
        )}
      </div>
    </Paragraph>
  );
});

Radio.displayName = 'Radio';
