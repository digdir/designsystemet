import cl from 'clsx/lite';
import {
  type ButtonHTMLAttributes,
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
  LabelHTMLAttributes<HTMLLabelElement> & {
    /** @deprecated Internal DOM structure has been changed to use label+input element */
    disabled?: ButtonHTMLAttributes<HTMLButtonElement>['disabled'];
    /** @deprecated Internal DOM structure has been changed to use label+input element */
    formAction?: ButtonHTMLAttributes<HTMLButtonElement>['formAction'];
    /** @deprecated Internal DOM structure has been changed to use label+input element */
    formEncType?: ButtonHTMLAttributes<HTMLButtonElement>['formEncType'];
    /** @deprecated Internal DOM structure has been changed to use label+input element */
    formMethod?: ButtonHTMLAttributes<HTMLButtonElement>['formMethod'];
    /** @deprecated Internal DOM structure has been changed to use label+input element */
    formNoValidate?: ButtonHTMLAttributes<HTMLButtonElement>['formNoValidate'];
    /** @deprecated Internal DOM structure has been changed to use label+input element */
    formTarget?: ButtonHTMLAttributes<HTMLButtonElement>['formTarget'];
    /** @deprecated Internal DOM structure has been changed to use label+input element */
    name?: ButtonHTMLAttributes<HTMLButtonElement>['name'];
  };

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
    disabled,
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    name,
    ...labelProps
  } = rest;

  /** Add backwards compatibility for `button` props that were previously allowed on `ToggleGroupItem` but are passeable to `input`*/
  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    disabled,
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    name,
  };

  return (
    <label
      ref={ref}
      {...labelProps}
      className={cl('ds-button', className)}
      data-variant='tertiary'
    >
      <input
        {...inputProps}
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
