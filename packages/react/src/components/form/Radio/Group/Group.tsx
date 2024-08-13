import cl from 'clsx/lite';
import type { ReactNode } from 'react';
import { createContext, forwardRef, useId } from 'react';

import type { FieldsetProps } from '../../Fieldset';
import { Fieldset } from '../../Fieldset';

export type RadioGroupContextProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: (value: string) => void;
};

export const RadioGroupContext = createContext<RadioGroupContextProps | null>(
  null,
);

export type RadioGroupProps = {
  /** Collection of `Radio` components */
  children?: ReactNode;
  /** Controlled state for `Radio` */
  value?: string;
  /** Default checked `Radio` */
  defaultValue?: string;
  /** Callback event with checked `Radio` value */
  onChange?: (value: string) => void;
  /** Toggle if collection of `Radio` are required  */
  required?: boolean;
  /** Orientation of `Radio` components.
   * @note Only use `horizontal` for when you have two options and short labels
   */
  inline?: boolean;
} & Omit<FieldsetProps, 'onChange'>;

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      onChange,
      children,
      value,
      readOnly,
      defaultValue,
      name,
      size = 'md',
      required,
      inline,
      className,
      ...rest
    },
    ref,
  ) => {
    const nameId = useId();

    return (
      <Fieldset
        readOnly={readOnly}
        size={size}
        className={className}
        ref={ref}
        {...rest}
      >
        <RadioGroupContext.Provider
          value={{
            value,
            defaultValue,
            name: name ?? `radiogroup-name-${nameId}`,
            onChange,
            required,
          }}
        >
          <div
            className={cl(
              'ds-radio__group',
              `ds-radio__group--${size}`,
              inline && 'ds-radio__group--horizontal',
            )}
          >
            {children}
          </div>
        </RadioGroupContext.Provider>
      </Fieldset>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
