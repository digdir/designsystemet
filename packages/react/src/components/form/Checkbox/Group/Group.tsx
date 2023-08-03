import type { ChangeEventHandler, ReactNode } from 'react';
import React, { forwardRef, createContext } from 'react';
import cn from 'classnames';

import type { FieldsetProps } from '../../Fieldset';
import { Fieldset } from '../../Fieldset';
import type { CheckboxProps } from '../Checkbox';

import classes from './Group.module.css';

export type CheckboxGroupContextProps = {
  value?: string | ReadonlyArray<string> | number;
  defaultValue?: string | ReadonlyArray<string> | number;
  required?: boolean;
} & Pick<CheckboxProps, 'onChange'>;

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextProps | null>(null);

export type CheckboxGroupProps = {
  /** Collection of `Checkbox` components */
  children?: ReactNode;
  /** Controlled state for `Checkbox` */
  value?: string | ReadonlyArray<string> | number;
  /** Default checked `Checkbox` */
  defaultValue?: string | ReadonlyArray<string> | number;
  /** Callback event with changed `Checkbox` */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Toggle if collection of `Checkbox` are required  */
  required?: boolean;
} & Omit<FieldsetProps, 'onChange'>;

export const CheckboxGroup = forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(
  (
    {
      onChange,
      children,
      value,
      readOnly,
      defaultValue,
      size = 'medium',
      required,
      ...rest
    },
    ref,
  ) => {
    return (
      <Fieldset
        {...rest}
        readOnly={readOnly}
        size={size}
        ref={ref}
      >
        <CheckboxGroupContext.Provider
          value={{
            value,
            defaultValue,
            onChange,
            required,
          }}
        >
          <div className={cn(classes[size])}>{children}</div>
        </CheckboxGroupContext.Provider>
      </Fieldset>
    );
  },
);
