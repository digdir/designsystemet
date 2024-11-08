import { useMergeRefs } from '@floating-ui/react';
import { useEffect, useId, useRef, useState } from 'react';
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
  /**
   * Initial value of the group
   */
  value?: string;
  /** Callback when selected radios changes */
  onChange?: (nextValue: string, prevValue: string) => void;
};

/**
 * Get anything that is set on a radio, but
 * remove anything that comes from the group itself.
 */
type GetRadioPropsType =
  | string
  | (Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      | 'prefix'
      | 'role'
      | 'type'
      | 'size'
      | 'aria-label'
      | 'aria-labelledby'
      | 'label'
      | 'name'
      | 'checked'
      | 'value'
    > & {
      ref?: React.RefObject<HTMLInputElement>;
      value?: string;
    });

/**
 * useRadioGroup is used to group multiple <Radio> components
 * @example
 * const { getRadioProps, validationMessageProps, value, setValue } = useRadioGroup({
 *   disabled: false,
 *   error: 'Validation message text',
 *   name: 'group-name',
 *   onChange: (nextValue, prevValue) => {},
 *   readOnly: false,
 *   required: true,
 *   value: '',
 * });
 */
export function useRadioGroup({
  error,
  required,
  name,
  onChange,
  value: initalValue = '',
}: UseRadioGroupProps = {}) {
  const [currentValue, setValue] = useState(initalValue);
  const errorId = useId();
  const nameFallback = useId();
  const nameRendered = name || nameFallback;

  const getRadioProps = (propsOrValue: GetRadioPropsType) => {
    const props =
      typeof propsOrValue === 'string'
        ? { value: propsOrValue }
        : propsOrValue || {};
    const { ref = undefined, value = '', ...rest } = props;
    const localRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = localRef.current;
      const isInput = input instanceof HTMLInputElement;

      if (isInput && input.name === nameRendered) {
        setValue((prevValue) => {
          onChange?.(input.value, prevValue);
          return input.value;
        });
      }
    };

    const mergedRefs = useMergeRefs([ref, localRef]);

    useEffect(() => {
      if (!localRef.current) return;
      localRef.current.checked = value === currentValue;
    }, [currentValue, value]);

    return {
      /* Spread anything the user has set first */
      ...rest,
      /* Concat ours with the user prop */
      'aria-describedby': error
        ? `${errorId} ${rest['aria-describedby']}`
        : rest['aria-describedby'],
      'aria-invalid': !!error || rest['aria-invalid'],
      name: nameRendered,
      value,
      ref: mergedRefs,
      required,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        rest.onChange?.(e);
        if (e.defaultPrevented) return;
        handleChange(e);
      },
    };
  };

  return {
    /**
     * Current value of the group.
     */
    value: currentValue,
    /**
     * Set the value of the group.
     *
     * @param value string[]
     * @returns void
     */
    setValue,
    /**
     * Props to send to the `Radio` component.
     * @example
     * <Radio label="Option 1" {...getRadioProps('option-1')} />
     */
    getRadioProps,
    /**
     * Props to send to the `ValidationMessage` component.
     *
     * @example
     * <ValidationMessage {...validationMessageProps} />
     */
    validationMessageProps: {
      children: error,
      hidden: !error,
      id: errorId,
    },
  };
}
