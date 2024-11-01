import { type ChangeEvent, type ReactNode, useId, useState } from 'react';

export type UseRadioGroupProps = {
  disabled?: boolean;
  error?: ReactNode;
  name?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (
    nextValue: string,
    currentValue: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

export function useRadioGroup({
  error,
  name,
  onChange,
  value = '',
  ...rest
}: UseRadioGroupProps) {
  const [currentValue, setValue] = useState(value);
  const nameFallback = useId();
  const errorId = useId();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onChange?.(nextValue, currentValue, event);
  };

  return {
    value: currentValue,
    setValue,
    getRadioProps: (value: string) => ({
      'aria-describedby': error ? errorId : undefined,
      'aria-invalid': error ? true : undefined,
      checked: currentValue === value,
      name: name || nameFallback,
      onChange: handleChange,
      value,
      ...rest,
    }),
    validationMessageProps: {
      children: error,
      hidden: !error,
      id: errorId,
    },
  };
}
