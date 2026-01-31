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
  { className, children, icon, value: rawValue, ...rest },
  ref,
) {
  const genValue = useId();
  const toggleGroup = useContext(ToggleGroupContext);
  const value = rawValue ?? genValue;
  const active = toggleGroup.value === value;

  return (
    <label
      ref={ref}
      {...rest}
      className={cl('ds-button', className)}
      data-variant='tertiary'
    >
      <input
        checked={active}
        name={toggleGroup.name}
        onChange={() => toggleGroup.onChange?.(value)}
        type='radio'
        value={value}
      />
      {children}
    </label>
  );
});
