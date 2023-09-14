import type { HTMLAttributes } from 'react';
import React, { createContext, forwardRef } from 'react';
import cn from 'classnames';

import classes from './ToggleGroup.module.css';

export type ToggleGroupContextProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size: 'small' | 'medium' | 'large';
};

export const ToggleGroupContext = createContext<ToggleGroupContextProps | null>(
  null,
);

export type ToggleGroupProps = {
  /** Description of what myProp does in the component */
  value: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size: 'small' | 'medium' | 'large';
} & Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'>;

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    { children, value, defaultValue, onChange, size = 'medium', ...rest },
    ref,
  ) => {
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
            onChange,
            size,
          }}
        >
          <div
            className={classes.groupContent}
            role='radiogroup'
          >
            {children}
          </div>
        </ToggleGroupContext.Provider>
      </div>
    );
  },
);
