import type { ChangeEventHandler, ReactNode } from 'react';
import React, { useState, forwardRef, createContext } from 'react';
import cn from 'classnames';

import type { FieldsetProps } from '../../Fieldset';
import { Fieldset } from '../../Fieldset';
import type { CheckboxProps } from '../Checkbox';

import classes from './Group.module.css';

export type CheckboxGroupContextProps = {
  value?: string[];
  defaultValue?: string[];
  toggleValue: (value: string) => void;
} & Pick<CheckboxProps, 'onChange'>;

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextProps | null>(null);

export type CheckboxGroupProps = {
  /** Collection of `Checkbox` components */
  children?: ReactNode;
  /** Controlled state for  `Checkbox`'s */
  value?: string[];
  /** Default checked `Checkbox`'s */
  defaultValue?: string[];
  /** Callback event with changed `Checkbox` element */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Callback event with changed value */
  onChangeValue?: (value: string[]) => void;
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
    const [internalValue, setInternalValue] = useState<string[]>(
      defaultValue ?? [],
    );

    const toggleValue: CheckboxGroupContextProps['toggleValue'] = (
      checkboxValue,
    ) => {
      const currentValue = value ?? internalValue;
      const updatedValue = currentValue.includes(checkboxValue)
        ? currentValue.filter((x) => x !== checkboxValue)
        : [...currentValue, checkboxValue];

      value ?? setInternalValue(updatedValue);
      onChangeValue?.(updatedValue);
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
