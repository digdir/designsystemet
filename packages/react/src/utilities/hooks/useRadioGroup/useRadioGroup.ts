import { useEffect, useId, useState } from 'react';
import type { ReactNode } from 'react';

export type UseRadioGroupProps = {
  /** Set disabled state of all radios */
  disabled?: boolean;
  /** Shared error message for all radios */
  error?: ReactNode;
  /** Name of all radios.
   * @default string of auto-generated name
   */
  name?: string;
  /** Set read only state of all radios */
  readOnly?: boolean;
  /** Set required state of all radios */
  required?: boolean;
  /** String value of selected radio */
  value?: string;
  /** Callback when selected radios changes */
  onChange?: (nextValue: string, prevValue: string, event: Event) => void;
};

/**
 * useRadioGroup is used to group multiple <Radio> components
 * @example
 * const { getRadioProps, validationMessageProps, value, setValue } = useRadioGroup({
 *   disabled: false,
 *   error: 'Validation message text',
 *   name: 'group-name',
 *   onChange: (nextValue, prevValue, event) => {},
 *   readOnly: false,
 *   required: true,
 *   value: '',
 * });
 */
export function useRadioGroup({
  error,
  name,
  onChange,
  value = '',
  ...rest
}: UseRadioGroupProps = {}) {
  const [currentValue, setValue] = useState(value);
  const validationId = useId();
  const nameFallback = useId();
  const nameRendered = name || nameFallback;

  // Using useEffect with addEventListener instead of avoids
  // crash with onChange props on the components
  useEffect(() => {
    const handleChange = (event: Event) => {
      const input = event.target;
      const isInput = input instanceof HTMLInputElement;

      if (!event.defaultPrevented && isInput && input.name === nameRendered)
        setValue((prevValue) => {
          onChange?.(input.value, prevValue, event);
          return input.value;
        });
    };
    document.addEventListener('change', handleChange);
    return () => document.removeEventListener('change', handleChange);
  }, [nameRendered]);

  return {
    value: currentValue,
    setValue,
    getRadioProps: (value: string) => {
      // input[type="radio"] does not trigger change event when controlled in React,
      // so instead we use defaultChecked and ensure correct input is checked on render
      useEffect(() => {
        const selector = `input[type="radio"][name="${nameRendered}"][value="${currentValue}"]`;
        const input = document.querySelector<HTMLInputElement>(selector);
        if (input) input.checked = true;
      }, [currentValue, nameRendered]);

      return {
        'aria-describedby': error ? validationId : undefined,
        'aria-invalid': Boolean(error) || undefined,
        defaultChecked: currentValue === value,
        name: nameRendered,
        value,
        ...rest,
      };
    },
    validationMessageProps: {
      children: error,
      id: validationId,
    },
  };
}
