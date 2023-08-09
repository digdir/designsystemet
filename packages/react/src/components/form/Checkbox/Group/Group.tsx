import type { ReactNode } from 'react';
import React, { useState, forwardRef, createContext } from 'react';

import type { FieldsetProps } from '../../Fieldset';
import { Fieldset } from '../../Fieldset';

import classes from './Group.module.css';

export type CheckboxGroupContextProps = {
  value?: string[];
  defaultValue?: string[];
  toggleValue: (value: string) => void;
};

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextProps | null>(null);

export type CheckboxGroupProps = {
  /** Collection of `Checkbox` components */
  children?: ReactNode;
  /** Controlled state for  `Checkbox`'s */
  value?: string[];
  /** Default checked `Checkbox`'s */
  defaultValue?: string[];
  /** Callback event with checked `Checkbox` values */
  onChange?: (value: string[]) => void;
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

      if (typeof value !== 'undefined' || value !== null) {
        setInternalValue(updatedValue);
      }
      onChange?.(updatedValue);
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
            toggleValue,
          }}
        >
          <div className={classes[size]}>{children}</div>
        </CheckboxGroupContext.Provider>
      </Fieldset>
    );
  },
);
