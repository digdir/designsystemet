import type { ChangeEventHandler, ReactNode } from 'react';
import React, { useState, forwardRef, createContext } from 'react';
import cn from 'classnames';

import type { FieldsetProps } from '../../Fieldset';
import { Fieldset } from '../../Fieldset';
import type { CheckboxProps } from '../Checkbox';

import classes from './Group.module.css';

export type CheckboxGroupContextProps = {
  value?: ReadonlyArray<string | number>;
  defaultValue?: ReadonlyArray<string | number>;
  toggleValue: (value: string | number) => void;
} & Pick<CheckboxProps, 'onChange'>;

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextProps | null>(null);

export type CheckboxGroupProps = {
  /** Collection of `Checkbox` components */
  children?: ReactNode;
  /** Controlled state for `Checkbox` */
  value?: ReadonlyArray<string | number>;
  /** Default checked `Checkbox` */
  defaultValue?: ReadonlyArray<string | number>;
  /** Callback event with changed `Checkbox` */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Callback event with changed balue */
  onChangeValue?: (value: Array<string | number>) => void;
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
      onChangeValue,
      ...rest
    },
    ref,
  ) => {
    const [checkedValues, setCheckedValues] = useState<
      ReadonlyArray<string | number>
    >(defaultValue ?? []);

    const toggleValue: CheckboxGroupContextProps['toggleValue'] = (value) => {
      const newValue = value ?? checkedValues;
      const updatedCheckedValues = checkedValues.includes(newValue)
        ? checkedValues.filter((x) => x !== newValue)
        : [...checkedValues, newValue];

      setCheckedValues(updatedCheckedValues);
      onChangeValue?.(updatedCheckedValues);
    };

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
            toggleValue,
          }}
        >
          <div className={cn(classes[size])}>{children}</div>
        </CheckboxGroupContext.Provider>
      </Fieldset>
    );
  },
);
