import { Slot, Slottable } from '@radix-ui/react-slot';
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
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
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
  { asChild, className, children, icon, value: rawValue, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'label';
  const genValue = useId();
  const toggleGroup = useContext(ToggleGroupContext);
  const value = rawValue ?? genValue;
  const active = toggleGroup.value === value;

  const {
    'aria-disabled': ariaDisabled,
    disabled,
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    required,
    ...labelProps
  } = rest;

  return (
    <Component
      aria-disabled={ariaDisabled ?? disabled}
      className={cl('ds-button', className)}
      data-variant='tertiary'
      ref={ref}
      {...(asChild && {
        'aria-checked': active,
        onClick: () => toggleGroup.onChange?.(value),
        role: 'radio',
      })}
      {...labelProps}
    >
      {!asChild && (
        <input
          aria-disabled={ariaDisabled}
          checked={active}
          disabled={disabled}
          form={form}
          formAction={formAction}
          formEncType={formEncType}
          formMethod={formMethod}
          formNoValidate={formNoValidate}
          formTarget={formTarget}
          name={toggleGroup.name}
          onChange={() => toggleGroup.onChange?.(value)}
          required={required}
          type='radio'
          value={value}
        />
      )}
      <Slottable>{children}</Slottable>
    </Component>
  );
});
