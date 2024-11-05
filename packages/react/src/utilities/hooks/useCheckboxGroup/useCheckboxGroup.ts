import { useMergeRefs } from '@floating-ui/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import type { CheckboxProps } from '../../../components/form/Checkbox';

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
    ref?: React.RefObject<HTMLInputElement>;
  },
) => CheckboxProps & {
  ref: React.RefObject<HTMLInputElement>;
  getCheckboxProps: GetCheckboxPropsType;
};

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

  const getCheckboxProps = (
    value: string,
    props?: Omit<
      InputHTMLAttributes<HTMLInputElement>,
      | 'prefix'
      | 'role'
      | 'type'
      | 'size'
      | 'aria-label'
      | 'aria-labelledby'
      | 'label'
    > & {
      allowIndeterminate?: boolean;
      ref?: React.RefObject<HTMLInputElement>;
    },
  ) => {
    const {
      allowIndeterminate = false,
      ref = undefined,
      ...restProps
    } = props || {};
    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!allowIndeterminate) return;
      if (!localRef.current) return;
      const checked = !!getInputs(true).length;
      const unchecked = !!getInputs(false).length;
      localRef.current.indeterminate = unchecked && checked;
      localRef.current.checked = !unchecked && checked;
    });

    const indeterminateChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!localRef.current) return;
      const checked = !!localRef.current.checked;
      for (const input of getInputs(!checked)) input.checked = checked;
      handleChange(event);
    };

    const mergedRefs = useMergeRefs([ref, localRef]);

    /* TODO make this better */
    return {
      'aria-describedby': error
        ? `${errorId} ${restProps['aria-describedby']}`
        : restProps['aria-describedby'],
      'aria-invalid': error ? true : undefined,
      checked: allowIndeterminate ? undefined : currentValue.includes(value),
      name: allowIndeterminate ? undefined : name || nameFallback,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        allowIndeterminate ? indeterminateChange(e) : handleChange(e);
        restProps.onChange?.(e);
      },
      ref: mergedRefs,
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
