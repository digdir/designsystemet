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
  size?: 'xsmall' | 'small' | 'medium';
} & HoistedRadioProps;

export const RadioGroupContext = createContext<RadioGroupContextProps | null>(
  null,
);

export type RadioGroupProps = {
  /** Description of what myProp does in the component */
  myProp?: boolean;
} & HoistedRadioProps &
  Omit<FieldsetProps, 'onChange'>;

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    { onChange, children, value, readOnly, defaultValue, name, size, ...rest },
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
            size,
          }}
        >
          {children}
        </RadioGroupContext.Provider>
      </Fieldset>
    );
  },
);
