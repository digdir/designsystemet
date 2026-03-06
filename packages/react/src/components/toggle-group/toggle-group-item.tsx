import cl from 'clsx/lite';
import { forwardRef, type LabelHTMLAttributes, useContext, useId } from 'react';
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
  /**
   * The **`readOnly`** property of the HTMLInputElement interface indicates that the user cannot modify the value of the input.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/readOnly)
   */
  readOnly?: boolean;
  /**
   * The **`HTMLInputElement.disabled`** property is a boolean value that reflects the `disabled` HTML attribute, which indicates whether the control is disabled.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/disabled)
   *
   * @note Avoid using if possible for accessibility purposes
   */
  disabled?: boolean;
} & DefaultProps &
  LabelHTMLAttributes<HTMLLabelElement>;

/**
 * A single item in a ToggleGroup.
 * @example
 * <ToggleGroupItem value='1'>Toggle 1</ToggleGroupItem>
 */
export const ToggleGroupItem = forwardRef<
  HTMLLabelElement,
  ToggleGroupItemProps
>(function ToggleGroupItem(
  { className, children, icon, value: rawValue, readOnly, disabled, ...rest },
  ref,
) {
  const genValue = useId();
  const toggleGroup = useContext(ToggleGroupContext);
  const value = rawValue ?? genValue;
  const active = toggleGroup.value === value;

  return (
    <label
      ref={ref}
      aria-disabled={disabled ?? toggleGroup.disabled}
      {...rest}
      className={cl('ds-button', className)}
      data-variant='tertiary'
    >
      <input
        checked={active}
        name={toggleGroup.name}
        onChange={() =>
          toggleGroup.readOnly || readOnly || toggleGroup.onChange?.(value)
        }
        type='radio'
        value={value}
        disabled={disabled ?? toggleGroup.disabled}
      />
      {children}
    </label>
  );
});
