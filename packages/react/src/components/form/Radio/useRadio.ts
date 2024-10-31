import { type ChangeEvent, type ReactNode, useId, useState } from 'react';

export type UseRadioProps = {
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

export function useRadio({
  error,
  name,
  onChange,
  value = '',
  ...rest
}: UseRadioProps) {
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
    getProps: (radioValue: string) => ({
      'aria-describedby': error ? errorId : undefined,
      'aria-invalid': !!error,
      checked: currentValue === radioValue,
      name: name || nameFallback,
      onChange: handleChange,
      value: radioValue,
      ...rest,
    }),
    validationMessageProps: {
      children: error,
      hidden: !error,
      id: errorId,
    },
  };
}
