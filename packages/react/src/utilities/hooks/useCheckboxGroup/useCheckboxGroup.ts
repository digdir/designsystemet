import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

export type UseCheckboxGroupProps = {
  disabled?: boolean;
  error?: ReactNode;
  name?: string;
  readOnly?: boolean;
  value?: string[];
  onChange?: (
    nextValue: string[],
    currentValue: string[],
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

type GetCheckboxPropsType = (
  value: string,
  props?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'prefix' | 'role' | 'type' | 'size'
  > & {
    allowIndeterminate?: boolean;
  },
) => Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'role' | 'type' | 'size'
>;

export function useCheckboxGroup({
  error,
  name,
  onChange,
  value = [],
  ...rest
}: UseCheckboxGroupProps) {
  const [currentValue, setValue] = useState(value);
  const nameFallback = useId();
  const errorId = useId();
  const getInputs = (checked: boolean) =>
    document.querySelectorAll<HTMLInputElement>(
      `input[type="checkbox"][name="${name || nameFallback}"]${checked ? ':checked' : ':not(:checked)'}`,
    );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Array.from(getInputs(true), ({ value }) => value);
    setValue(nextValue);
    onChange?.(nextValue, currentValue, event);
  };

  const getCheckboxProps: GetCheckboxPropsType = (
    value,
    { allowIndeterminate = false, ...restProps } = {},
  ) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!allowIndeterminate) return;
      if (!ref.current) return;
      const checked = !!getInputs(true).length;
      const unchecked = !!getInputs(false).length;
      ref.current.indeterminate = unchecked && checked;
      ref.current.checked = !unchecked && checked;
      console.log({
        checked,
        unchecked,
        getInputs: Array.from(getInputs(true), ({ value }) => value),
      });
    });

    const indeterminateChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!ref.current) return;
      const checked = !!ref.current?.checked;
      for (const input of getInputs(!checked)) input.checked = checked;
      handleChange(event);
    };

    return {
      'aria-describedby': error
        ? `${errorId} ${restProps['aria-describedby']}`
        : restProps['aria-describedby'],
      'aria-invalid': error ? true : undefined,
      checked: currentValue.includes(value),
      name: name || nameFallback,
      onChange: (e) => {
        allowIndeterminate ? indeterminateChange(e) : handleChange(e);
        restProps.onChange?.(e);
      },
      ref: allowIndeterminate ? ref : undefined,
      value: allowIndeterminate ? '' : value,
      ...rest,
      ...restProps,
    };
  };

  return {
    value: currentValue,
    setValue,
    getCheckboxProps,
    validationMessageProps: {
      children: error,
      hidden: !error,
      id: errorId,
    },
  };
}
