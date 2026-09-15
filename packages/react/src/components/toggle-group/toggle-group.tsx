import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { createContext, forwardRef, useId, useState } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type ToggleGroupContextProps = {
  variant?: 'primary' | 'secondary';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
};

export const ToggleGroupContext = createContext<ToggleGroupContextProps>({});

export type ToggleGroupProps = MergeRight<
  DefaultProps &
    Omit<
      HTMLAttributes<HTMLFieldSetElement>,
      'value' | 'onChange' | 'aria-label' | 'aria-labelledby'
    >,
  {
    /**
     * Specify which variant to use
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary';
    /**
     * Controlled state for `ToggleGroup` component.
     */
    value?: string;
    /**
     * Default value.
     */
    defaultValue?: string;
    /**
     * Callback with selected `ToggleGroupItem` `value`
     */
    onChange?: (value: string) => void;
    /**
     * Form element name
     */
    name?: string;
  } & (
    | {
        /**
         * Toggle group label for accessibility
         * @deprecated Use aria-label or aria-labelledby instead.
         */
        'data-toggle-group'?: string;
        'aria-label'?: never;
        'aria-labelledby'?: never;
      }
    | {
        'data-toggle-group'?: never;
        'aria-labelledby'?: never;
        'aria-label': string;
      }
    | {
        'data-toggle-group'?: never;
        'aria-labelledby': string;
        'aria-label'?: never;
      }
  )
>;

/**
 * Display a group of buttons that can be toggled between.
 *
 * @example
 * <ToggleGroup aria-label="Label" onChange={(value) => console.log(value)}>
 *   <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 *   <ToggleGroup.Item value='2'>Toggle 2</ToggleGroup.Item>
 *   <ToggleGroup.Item value='3'>Toggle 3</ToggleGroup.Item>
 * </ToggleGroup>
 */
export const ToggleGroup = forwardRef<HTMLFieldSetElement, ToggleGroupProps>(
  function ToggleGroup(
    {
      'data-toggle-group': label,
      children,
      className,
      defaultValue,
      name,
      onChange,
      value,
      variant,
      ...rest
    },
    ref,
  ) {
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
      <ToggleGroupContext.Provider
        value={{
          defaultValue,
          name: name ?? `togglegroup-name-${nameId}`,
          onChange: onValueChange,
          value,
          variant,
        }}
      >
        <fieldset
          aria-label={label} // Backwards compatible with data-toggle-group, but aria-label is preferred
          className={cl('ds-toggle-group', className)}
          data-variant={variant}
          focusgroup='radiogroup'
          ref={ref}
          suppressHydrationWarning // Since @digdir/designsystemet-web adds attributes
          {...rest}
        >
          {children}
        </fieldset>
      </ToggleGroupContext.Provider>
    );
  },
);
