import cl from 'clsx/lite';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { omit } from '../../../utilities';
import { Label } from '../../Label';
import { Input } from '../Input';
import type { FormFieldProps } from '../useFormField';

import { useRadio } from './useRadio';

export type RadioProps = {
  /** Radio label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const { children, description, className, style, ...rest } = props;
    const { inputProps, descriptionId, size = 'md' } = useRadio(props);

    return (
      <div className={cl('ds-radio', className)} data-size={size} style={style}>
        <Input
          disabled={inputProps.disabled}
          ref={ref}
          {...omit(['size', 'error'], rest)}
          {...inputProps}
        />
        {children && (
          <Label htmlFor={inputProps.id} size={size} weight='regular'>
            {children}
          </Label>
        )}
        {children && description && (
          <div id={descriptionId} className={'ds-radio__description'}>
            {description}
          </div>
        )}
      </div>
    );
  },
);
