import type { HTMLAttributes } from 'react';
import React, { createContext, forwardRef, useState } from 'react';
import cn from 'classnames';

import classes from './Tabs.module.css';

export type TabsProps = {
  /** Description of what myProp does in the component */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'small' | 'medium' | 'large';
} & Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'>;

export type TabsContextProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'small' | 'medium' | 'large';
};

export const TabsContext = createContext<TabsContextProps>({});

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    { children, value, defaultValue, onChange, size = 'medium', ...rest },
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
    return (
      <TabsContext.Provider
        value={{
          value,
          defaultValue,
          onChange: onValueChange,
          size,
        }}
      >
        <div
          {...rest}
          className={cn(classes.tabs, rest.className)}
          ref={ref}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
