import cl from 'clsx/lite';
import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  useContext,
  useId,
} from 'react';
import type { DefaultProps } from '../../types';
import { ToggleGroupContext } from './toggle-group';

export type ToggleGroupItemProps = {
  /**
   * The value of the ToggleGroupItem.
   * Generates a random value if not set.
   **/
  value?: string;
  /**
   * @deprecated Icon prop is deprecated
   **/
  icon?: boolean;
} & DefaultProps &
  LabelHTMLAttributes<HTMLLabelElement> &
  Pick<
    InputHTMLAttributes<HTMLInputElement>,
    | 'formAction'
    | 'formEncType'
    | 'formTarget'
    | 'formMethod'
    | 'required'
    | 'formNoValidate'
    | 'value'
    | 'disabled'
  >;

/**
 * A single item in a ToggleGroup.
 * @example
 * <ToggleGroupItem value='1'>Toggle 1</ToggleGroupItem>
 */
export const ToggleGroupItem = forwardRef<
  HTMLLabelElement,
  ToggleGroupItemProps
>(function ToggleGroupItem(
  { className, children, icon, value: rawValue, ...rest },
  ref,
) {
  const genValue = useId();
  const toggleGroup = useContext(ToggleGroupContext);
  const value = rawValue ?? genValue;
  const active = toggleGroup.value === value;

  const {
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    required,
    disabled,
    ...labelProps
  } = rest;

  /** Add backwards compatibility for `button` props that were previously allowed on `ToggleGroupItem` but are passeable to `input`*/
  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    required,
    disabled,
  };

  return (
    <label
      ref={ref}
      {...labelProps}
      className={cl('ds-button', className)}
      data-variant='tertiary'
      aria-disabled={disabled}
    >
      <input
        {...inputProps}
        checked={active}
        name={toggleGroup.name}
        onChange={() => toggleGroup.onChange?.(value)}
        type='radio'
        value={value}
        disabled={disabled}
      />
      {children}
    </label>
  );
});
