import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';

export type UseCheckboxProps = {
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

export function useCheckbox({
  error,
  name,
  onChange,
  value = [],
  ...rest
}: UseCheckboxProps) {
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

  return {
    value: currentValue,
    setValue,
    getProps: (checkboxValue: string) => ({
      'aria-describedby': error ? errorId : undefined,
      'aria-invalid': !!error,
      checked: currentValue.includes(checkboxValue),
      name: name || nameFallback,
      onChange: handleChange,
      value: checkboxValue,
      ...rest,
    }),
    getIndeterminateProps: () => {
      const ref = useRef<HTMLInputElement>(null);

      useEffect(() => {
        if (!ref.current) return;
        const checked = !!getInputs(true).length;
        const unchecked = !!getInputs(false).length;
        ref.current.indeterminate = unchecked && checked;
        ref.current.checked = !unchecked && checked;
      });

      return {
        ref,
        value: '',
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          const checked = !!ref.current?.checked;
          for (const input of getInputs(!checked)) input.checked = checked;
          handleChange(event);
        },
      };
    },
    validationMessageProps: {
      children: error,
      hidden: !error,
      id: errorId,
    },
  };
}
