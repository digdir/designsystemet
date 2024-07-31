import type { HTMLAttributes } from 'react';
import { createContext, forwardRef, useId, useState } from 'react';
import cl from 'clsx/lite';

import { RovingFocusRoot } from '../../utilities/RovingFocus';
import type { ButtonProps } from '../Button';

export type ToggleGroupContextProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  size?: ButtonProps['size'];
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
  /**
   * Changes items size and paddings
   * @default md
   */
  size?: ToggleGroupContextProps['size'];
} & Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'>;

/**
 * Display a group of buttons that can be toggled between.
 * @example
 * <ToggleGroup.Root onChange={(value) => console.log(value)}>
 *   <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 *   <ToggleGroup.Item value='2'>Toggle 2</ToggleGroup.Item>
 *   <ToggleGroup.Item value='3'>Toggle 3</ToggleGroup.Item>
 * </ToggleGroup.Root>
 */
export const ToggleGroupRoot = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      size = 'md',
      children,
      value,
      defaultValue,
      onChange,
      name,
      className,
      ...rest
    },
    ref,
  ) => {
    const nameId = useId();
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
      <div className={cl('ds-togglegroup', className)} ref={ref} {...rest}>
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
              className='ds-togglegroup__input'
              name={name}
              value={value}
            />
          )}
          <RovingFocusRoot asChild activeValue={value}>
            <div className='ds-togglegroup__content' role='radiogroup'>
              {children}
            </div>
          </RovingFocusRoot>
        </ToggleGroupContext.Provider>
      </div>
    );
  },
);

ToggleGroupRoot.displayName = 'ToggleGroupRoot';
