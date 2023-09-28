import type { HTMLAttributes } from 'react';
import React, { createContext, forwardRef, useId, useState } from 'react';
import cn from 'classnames';

import { RovingTabindexRoot } from '../../utility-components/RovingTabIndex';

import classes from './ToggleGroup.module.css';

export type ToggleGroupContextProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  size?: 'small' | 'medium' | 'large';
};

export const ToggleGroupContext = createContext<ToggleGroupContextProps>({});

export type ToggleGroupProps = {
  /** Controlled state for `ToggleGroup` component. */
  value?: string;
  /** Default value. */
  defaultValue?: string;
  /** Callback with selected `ToggleGroupItem` `value` */
  onChange?: (value: string) => void;
  /** Form element name */
  name?: string;
  /** Changes items size and paddings */
  size?: 'small' | 'medium' | 'large';
} & Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'>;

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    { children, value, defaultValue, onChange, size = 'medium', name, ...rest },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | undefined
    >(defaultValue);

    let onValueChange = onChange;
    if (!isControlled) {
      onValueChange = (newValue: string) => {
        setUncontrolledValue(newValue);
        onChange?.(newValue);
      };
      value = uncontrolledValue;
    }
    const nameId = useId();

    return (
      <div
        {...rest}
        className={cn(classes.toggleGroupContainer, rest.className)}
        ref={ref}
      >
        <ToggleGroupContext.Provider
          value={{
            value,
            defaultValue,
            name: name ?? `radiogroup-name-${nameId}`,
            onChange: onValueChange,
            size,
          }}
        >
          <RovingTabindexRoot
            as='div'
            valueId={value}
            className={classes.groupContent}
            role='radiogroup'
          >
            {children}
          </RovingTabindexRoot>
        </ToggleGroupContext.Provider>
      </div>
    );
  },
);
