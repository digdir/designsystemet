import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

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
          'ds-radio',
          `ds-radio--${size}`,
          hasError && `ds-radio--error`,
          readOnly && `ds-radio--readonly`,
          className,
        )}
        style={style}
      >
        <input
          className={'ds-radio__input'}
          disabled={inputProps.disabled}
          ref={ref}
          {...omit(['size', 'error'], rest)}
          {...inputProps}
        />
        {children && (
          <>
            <Label
              className={cl('ds-radio__label', 'ds-font-weight--regular')}
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
                  className={'ds-radio__description'}
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
