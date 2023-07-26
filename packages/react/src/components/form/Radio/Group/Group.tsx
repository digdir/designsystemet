import type { ReactNode } from 'react';
import React, { forwardRef, createContext, useId } from 'react';
import cl from 'classnames';

import type { FieldsetProps } from '../../Fieldset';
import { Fieldset } from '../../Fieldset';
import type { RadioProps } from '../Radio';

import classes from './Group.module.css';

type HoistedRadioProps = Partial<
  Pick<RadioProps, 'required' | 'defaultValue' | 'onChange'>
>;

export type RadioGroupContextProps = {
  name?: string;
  value?: string | ReadonlyArray<string> | number;
  readOnly?: boolean;
} & HoistedRadioProps;

export const RadioGroupContext = createContext<RadioGroupContextProps | null>(
  null,
);

export type RadioGroupProps = {
  /** Collection of `Radio` components */
  children?: ReactNode;
  /** Controlled state for `Radio` */
  value?: string | ReadonlyArray<string> | number;
} & HoistedRadioProps &
  Omit<FieldsetProps, 'onChange'>;

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      onChange,
      children,
      value,
      readOnly,
      defaultValue,
      name,
      size = 'medium',
      ...rest
    },
    ref,
  ) => {
    const nameId = useId();

    return (
      <Fieldset
        {...rest}
        readOnly={readOnly}
        size={size}
        className={cl(rest.className)}
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
          <div className={cl(classes[size])}>{children}</div>
        </RadioGroupContext.Provider>
      </Fieldset>
    );
  },
);
