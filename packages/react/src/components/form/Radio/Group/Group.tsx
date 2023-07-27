import type { ChangeEventHandler, ReactNode } from 'react';
import React, { forwardRef, createContext, useId } from 'react';
import cl from 'classnames';

import type { FieldsetProps } from '../../Fieldset';
import { Fieldset } from '../../Fieldset';
import type { RadioProps } from '../Radio';

import classes from './Group.module.css';

export type RadioGroupContextProps = {
  name?: string;
  value?: string | ReadonlyArray<string> | number;
  defaultValue?: string | ReadonlyArray<string> | number;
  required?: boolean;
} & Pick<RadioProps, 'onChange'>;

export const RadioGroupContext = createContext<RadioGroupContextProps | null>(
  null,
);

export type RadioGroupProps = {
  /** Collection of `Radio` components */
  children?: ReactNode;
  /** Controlled state for `Radio` */
  value?: string | ReadonlyArray<string> | number;
  /** Default checked `Radio` */
  defaultValue?: string | ReadonlyArray<string> | number;
  /** Callback event with changed `Radio` */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Toggle if collection of `Radio` are required  */
  required?: boolean;
} & Omit<FieldsetProps, 'onChange'>;

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
      required,
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
            defaultValue,
            name: name ?? `radiogroup-name-${nameId}`,
            onChange,
            required,
          }}
        >
          <div className={cl(classes[size])}>{children}</div>
        </RadioGroupContext.Provider>
      </Fieldset>
    );
  },
);
