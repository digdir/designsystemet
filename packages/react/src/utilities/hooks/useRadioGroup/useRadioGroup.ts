import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import type { RadioProps } from '../../../components';

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
export type GetRadioProps = Omit<
  RadioProps,
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
  ref?: React.ForwardedRef<HTMLInputElement>; // Use this to match Ref from `Radio`, remove when `Radio` no longer uses `forwardRef`
  value?: string;
};

type useRadioGroupReturn = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  getRadioProps: (propsOrValue: string | GetRadioProps) => GetRadioProps;
  validationMessageProps: {
    children: ReactNode;
    hidden: boolean;
    id: string;
  };
};

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
  readOnly,
  required,
  disabled,
  name,
  onChange,
  value: initalValue = '',
}: UseRadioGroupProps = {}): useRadioGroupReturn {
  const [groupValue, setGroupValue] = useState(initalValue);
  const errorId = useId();
  const namedId = useId();
  const radioGroupName = name || namedId;

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
     * Props to send to the `Radio` component.
     * @example
     * <Radio label="Option 1" {...getRadioProps('option-1')} />
     */
    getRadioProps: (propsOrValue: string | GetRadioProps) => {
      const props =
        typeof propsOrValue === 'string'
          ? { value: propsOrValue }
          : propsOrValue;
      const { ref: forwardedRef = undefined, value = '', ...rest } = props;

      const handleRef = (element: HTMLInputElement | null) => {
        if (element) {
          // Set initial checked state
          element.checked = value === groupValue;
        }

        // Handle forwarded ref
        if (forwardedRef) {
          if (typeof forwardedRef === 'function') {
            forwardedRef(element);
          } else {
            forwardedRef.current = element;
          }
        }
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === radioGroupName) {
          setGroupValue((prevValue) => {
            onChange?.(e.target.value, prevValue);
            return e.target.value;
          });
        }
      };

      return {
        ...rest,
        name: radioGroupName,
        'aria-describedby':
          `${error ? errorId : ''} ${rest['aria-describedby'] || ''}`.trim() ||
          undefined,
        'aria-invalid': !!error || rest['aria-invalid'],
        value,
        ref: handleRef,
        required: required || rest.required,
        readOnly: readOnly || rest.readOnly,
        disabled: disabled || rest.disabled,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          rest.onChange?.(e);
          if (e.defaultPrevented) return;
          handleChange(e);
        },
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
