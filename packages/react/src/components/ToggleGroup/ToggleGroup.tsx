import type { HTMLAttributes } from 'react';
import { createContext, forwardRef, useId, useState } from 'react';
import cl from 'clsx';

import { RovingTabindexRoot } from '../../utilities/RovingTabIndex';

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

/** `ToggleGroup` component.
 * @example
 * ```tsx
 * <ToggleGroup onChange={(value) => console.log(value)}>
 *   <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 *   <ToggleGroup.Item value='2'>Toggle 2</ToggleGroup.Item>
 *   <ToggleGroup.Item value='3'>Toggle 3</ToggleGroup.Item>
 * </ToggleGroup>
 * ```
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ children, value, defaultValue, onChange, size = 'medium', name, className, ...rest }, ref) => {
    const nameId = useId();
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);

    let onValueChange = onChange;
    if (!isControlled) {
      onValueChange = (newValue: string) => {
        setUncontrolledValue(newValue);
        onChange?.(newValue);
      };
      value = uncontrolledValue;
    }

    return (
      <div
        className={cl(classes.toggleGroupContainer, className)}
        ref={ref}
        {...rest}
      >
        <ToggleGroupContext.Provider
          value={{
            value,
            defaultValue,
            name: name ?? `togglegroup-name-${nameId}`,
            onChange: onValueChange,
            size,
          }}
        >
          {name && (
            <input
              type='hidden'
              name={name}
              value={value}
            />
          )}
          <RovingTabindexRoot
            asChild
            valueId={value}
          >
            <div
              className={classes.groupContent}
              role='radiogroup'
            >
              {children}
            </div>
          </RovingTabindexRoot>
        </ToggleGroupContext.Provider>
      </div>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';
