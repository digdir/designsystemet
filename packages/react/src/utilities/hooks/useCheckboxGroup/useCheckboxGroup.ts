import { useMergeRefs } from '@floating-ui/react';
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

/**
 * Get anything that is set on a checkbox, but
 * remove anything that comes from the group itself.
 */
type GetCheckboxPropsType = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'prefix'
  | 'role'
  | 'type'
  | 'size'
  | 'aria-label'
  | 'aria-labelledby'
  | 'label'
  | 'name'
  | 'value'
  | 'checked'
  | 'disabled'
  | 'readOnly'
> & {
  allowIndeterminate?: boolean;
  ref?: React.RefObject<HTMLInputElement>;
};

export function useCheckboxGroup({
  error,
  name,
  onChange,
  value = [],
  disabled,
  readOnly,
}: UseCheckboxGroupProps) {
  const [currentValue, setValue] = useState(value);
  const nameFallback = useId();
  const errorId = useId();
  const checkboxRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const getInputs = (checked: boolean) => {
    const inputs: HTMLInputElement[] = [];
    for (const [_, input] of checkboxRefs.current) {
      if (input.checked === checked) {
        inputs.push(input);
      }
    }
    return inputs;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Array.from(getInputs(true), ({ value }) => value);
    setValue(nextValue);
    onChange?.(nextValue, currentValue, event);
  };

  const getCheckboxProps = (value: string, props?: GetCheckboxPropsType) => {
    const {
      allowIndeterminate = false,
      ref = undefined,
      ...rest
    } = props || {};
    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!allowIndeterminate || !localRef.current) return;
      const checked = !!getInputs(true).length;
      const unchecked = !!getInputs(false).length;
      localRef.current.indeterminate = unchecked && checked;
      localRef.current.checked = !unchecked && checked;
    });

    useEffect(() => {
      if (localRef.current && !allowIndeterminate) {
        checkboxRefs.current.set(value, localRef.current);
      }
      return () => {
        checkboxRefs.current.delete(value);
      };
    }, [value]);

    const indeterminateChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!localRef.current) return;
      const checked = !!localRef.current.checked;
      for (const input of getInputs(!checked)) {
        input.checked = checked;
      }
    };

    const mergedRefs = useMergeRefs([ref, localRef]);

    const {
      'aria-describedby': userAriaDescribedBy,
      onChange: userOnChange,
      ...userRest
    } = rest;

    return {
      /* Spread anything the user has set first */
      ...userRest,
      /* Concat ours with the user prop */
      'aria-describedby': error
        ? `${errorId} ${userAriaDescribedBy}`
        : userAriaDescribedBy,
      'aria-invalid': error ? true : undefined,
      checked: allowIndeterminate ? undefined : currentValue.includes(value),
      name: allowIndeterminate ? undefined : name || nameFallback,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        allowIndeterminate && indeterminateChange(e);
        handleChange(e);
        userOnChange?.(e);
      },
      ref: mergedRefs,
      value: allowIndeterminate ? '' : value,
      disabled,
      readOnly,
    };

    /* TODO make this better */
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
