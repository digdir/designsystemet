import type { InputHTMLAttributes } from 'react';
import React, { useContext, forwardRef, createContext, useId } from 'react';
import cn from 'classnames';

import type { FieldsetProps } from '../../Fieldset';
import { Fieldset, FieldsetContext } from '../../Fieldset';

import classes from './Group.module.css';

type HoistedRadioProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'readOnly' | 'required' | 'defaultValue' | 'onChange'
>;

export type RadioGroupContextProps = {
  name?: string;
} & HoistedRadioProps;

export const RadioGroupContext = createContext<RadioGroupContextProps | null>(
  null,
);

export type RadioGroupProps = {
  orientation?: 'horizontal' | 'vertical';
} & HoistedRadioProps &
  Omit<FieldsetProps, 'onChange'>;

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    { onChange, children, value, readOnly, defaultValue, name, ...rest },
    ref,
  ) => {
    const nameId = useId();

    return (
      <Fieldset
        {...rest}
        className={cn(rest.className)}
        ref={ref}
      >
        <RadioGroupContext.Provider
          value={{
            value,
            readOnly,
            defaultValue,
            name: name ?? `radiogroup-name-${nameId}`,
            onChange,
          }}
        >
          <div>{children}</div>
        </RadioGroupContext.Provider>
      </Fieldset>
    );
  },
);
