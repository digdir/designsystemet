import { useEffect, useId, useState } from 'react';
import type { ReactNode } from 'react';

export type UseCheckboxGroupProps = {
  /** Set disabled state of all checkboxes */
  disabled?: boolean;
  /** Shared error message for all checkboxes */
  error?: ReactNode;
  /** Name of all checkboxes.
   * @default string of auto-generated name
   */
  name?: string;
  /** Set read only state of all checkboxes */
  readOnly?: boolean;
  /** Set required state of all checkboxes */
  required?: boolean;
  /** Array of values of selected checkboxes */
  value?: string[];
  /** Callback when selected checkboxes changes */
  onChange?: (nextValue: string[], prevValue: string[], event: Event) => void;
};

/**
 * useCheckboxGroup is used to group multiple <Checkbox> components
 * @example
 * const { getCheckboxProps, validationMessageProps, value, setValue } = useCheckboxGroup({
 *   disabled: false,
 *   error: 'Validation message text',
 *   name: 'group-name',
 *   onChange: (nextValue, prevValue, event) => {},
 *   readOnly: false,
 *   required: true,
 *   value: [''],
 * });
 */
export function useCheckboxGroup({
  error,
  name,
  onChange,
  value = [],
  ...rest
}: UseCheckboxGroupProps = {}) {
  const [currentValue, setValue] = useState(value);
  const validationId = useId();
  const nameFallback = useId();
  const nameRendered = name || nameFallback;
  const multiple = 'data-multiple';

  const getInputs = (checked: boolean | undefined) =>
    document.querySelectorAll<HTMLInputElement>(
      `input[type="checkbox"][name="${nameRendered}"]${checked === undefined ? `[${multiple}]` : `:not([${multiple}])${checked ? ':checked' : ':not(:checked)'}`}`,
    );

  // Using useEffect with addEventListener instead of avoids
  // crash with onChange props on the components
  useEffect(() => {
    const handleChange = (event: Event) => {
      const input = event.target;
      const isInput = input instanceof HTMLInputElement;

      if (!event.defaultPrevented && isInput && input.name === nameRendered)
        setValue((prevValue) => {
          const isMultiple = input.hasAttribute(multiple);
          const isChecked = input.checked;

          if (!isMultiple) input.checked = !isChecked;
          else
            for (const input of getInputs(!isChecked))
              input.checked = isChecked;

          const nextValue = Array.from(getInputs(true), ({ value }) => value);

          onChange?.(nextValue, prevValue, event);
          return nextValue;
        });
    };
    document.addEventListener('change', handleChange);
    return () => document.removeEventListener('change', handleChange);
  }, [nameRendered]);

  return {
    value: currentValue,
    setValue,
    getCheckboxProps: (value: string | { multiple: boolean }) => {
      const isMultiple = typeof value !== 'string';

      // Handle { multiple: true } checkboxes which can be indeterminate
      useEffect(() => {
        if (!isMultiple) return;
        const checked = !!getInputs(true).length;
        const unchecked = !!getInputs(false).length;

        for (const input of getInputs(undefined)) {
          input.indeterminate = unchecked && checked;
          input.checked = !unchecked && checked;
        }
      });

      return {
        'aria-describedby': error ? validationId : undefined,
        'aria-invalid': Boolean(error) || undefined,
        name: nameRendered,
        value: isMultiple ? undefined : value,
        ...(isMultiple
          ? { [multiple]: true }
          : { checked: currentValue.includes(value), value }),
        ...rest,
      };
    },
    validationMessageProps: {
      children: error,
      id: validationId,
    },
  };
}
