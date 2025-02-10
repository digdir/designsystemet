import { useMergeRefs } from '@floating-ui/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { CheckboxProps } from '../../../components';

export type UseCheckboxGroupProps = {
  /**
   * Disables all checkboxes in the group.
   */
  disabled?: boolean;
  /**
   * Error message for the group.
   * If set, all checkboxes will have `aria-invalid` set to `true`.
   */
  error?: ReactNode;
  /**
   * Name of the group.
   * If not set, a random id will be generated.
   */
  name?: string;
  /**
   * Makes all checkboxes in the group read-only.
   * If set, all checkboxes will have `aria-readonly` set to `true`.
   */
  readOnly?: boolean;
  /**
   * Initial value of the group
   * @default []
   */
  value?: string[];
  /**
   * Makes all checkboxes in the group required.
   * If set, all checkboxes will have `required` set to `true`.
   */
  required?: boolean;
  /**
   * Callback that is called when the value of the group changes.
   * @param nextValue string[]
   * @param currentValue string[]
   * @returns void
   */
  onChange?: (nextValue: string[], currentValue: string[]) => void;
};

/**
 * Get anything that is set on a checkbox, but
 * remove anything that comes from the group itself.
 */
export type GetCheckboxProps = Omit<
  CheckboxProps,
  | 'prefix'
  | 'role'
  | 'type'
  | 'size'
  | 'aria-label'
  | 'aria-labelledby'
  | 'label'
  | 'checked'
  | 'value'
> & {
  /** Enables indeterminate handling for this `Checkbox` and `CheckboxGroup` */
  allowIndeterminate?: boolean;
  ref?: React.ForwardedRef<HTMLInputElement>; // Use this to match Ref from `Checkbox`, remove when `Checkbox` no longer uses `forwardRef`
  checked?: boolean;
  value?: string;
};

const toggleIndeterminate = (
  getIndeterminateInputs: () => HTMLInputElement[],
  getInputs: (checked: boolean) => HTMLInputElement[],
) => {
  const inputs = getIndeterminateInputs();
  const checked = !!getInputs(true).length;
  const unchecked = !!getInputs(false).length;

  for (const input of inputs) {
    input.indeterminate = unchecked && checked;
    input.checked = !unchecked && checked;
  }
};

type useCheckboxGroupReturn = {
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  getCheckboxProps: (
    propsOrValue?: string | GetCheckboxProps,
  ) => GetCheckboxProps;
  validationMessageProps: {
    children: ReactNode;
    hidden: boolean;
    id: string;
  };
};

export function useCheckboxGroup(
  props?: UseCheckboxGroupProps,
): useCheckboxGroupReturn {
  const {
    error,
    name: groupName,
    onChange,
    value = [],
    disabled,
    readOnly,
    required,
  } = props || {};

  const [groupValue, setGroupValue] = useState(value);
  const namedId = useId();
  const errorId = useId();
  const checkboxRefs = useRef<Set<HTMLInputElement>>(new Set());
  const indeterminateRefs = useRef<Set<HTMLInputElement>>(new Set());

  const getInputs = (checked: boolean) =>
    Array.from(checkboxRefs.current.values()).filter(
      (input) => input.checked === checked,
    );

  const getIndeterminateInputs = () =>
    Array.from(indeterminateRefs.current.values());

  return {
    /**
     * Current value of the group.
     */
    value: groupValue,
    /**
     * Set the value of the group.
     *
     * @param value string[]
     * @returns void
     */
    setValue: setGroupValue,
    /**
     * Props to send to the `Checkbox` component.
     * Accepts value or object
     * @example
     * <Checkbox {...getCheckboxProps('value')} />
     *
     * @example allow indeterminate
     * <Checkbox {...getCheckboxProps({ value: 'all', allowIndeterminate: true })} />
     */
    getCheckboxProps: (propsOrValue?: string | GetCheckboxProps) => {
      const props =
        typeof propsOrValue === 'string'
          ? { value: propsOrValue }
          : propsOrValue || {};

      const {
        allowIndeterminate = false,
        ref = undefined,
        value = '',
        ...rest
      } = props;

      const inputRef = useRef<HTMLInputElement>(null);
      const mergedRefs = useMergeRefs([ref, inputRef]);

      const handleChange = () => {
        const nextGroupValue = Array.from(
          getInputs(true),
          ({ value }) => value,
        );
        setGroupValue(nextGroupValue);
        onChange?.(nextGroupValue, groupValue);
      };

      const indeterminateChange = () => {
        if (!inputRef.current) return;
        const checked = !!inputRef.current.checked;
        for (const input of getInputs(!checked)) {
          /* We use click to send both event and change checked state */
          input.click();
        }
      };

      useEffect(() => {
        if (!allowIndeterminate) return;

        toggleIndeterminate(getIndeterminateInputs, getInputs);
      }, [groupValue]);

      useEffect(() => {
        if (!inputRef.current) return;

        const input = inputRef.current;
        const refs = allowIndeterminate ? indeterminateRefs : checkboxRefs;
        refs.current.add(input);

        if (getIndeterminateInputs().length)
          toggleIndeterminate(getIndeterminateInputs, getInputs);

        return () => {
          refs.current.delete(input);
        };
      }, [value]);

      return {
        /* Spread anything the user has set first */
        ...rest,
        /* Concat ours with the user prop */
        'aria-describedby':
          `${error ? errorId : ''} ${rest['aria-describedby'] || ''}`.trim() ||
          undefined,
        'aria-invalid': !!error || rest['aria-invalid'],
        checked: allowIndeterminate ? undefined : groupValue.includes(value),
        name: rest.name || groupName || namedId,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          rest.onChange?.(e);
          if (e.defaultPrevented) return;
          allowIndeterminate && indeterminateChange();
          handleChange();
        },
        ref: mergedRefs,
        value,
        disabled: disabled || rest.disabled,
        readOnly: readOnly || rest.readOnly,
        required: required || rest.required,
      };
    },
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
