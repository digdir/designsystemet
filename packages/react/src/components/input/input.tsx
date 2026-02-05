import cl from 'clsx/lite';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

type InputAttr = InputHTMLAttributes<HTMLInputElement>;

export type InputProps = MergeRight<
  DefaultProps & Omit<InputAttr, 'prefix' | 'type'>,
  {
    /**
     * Supported `input` types
     *
     * @default 'text'
     * */
    type?: /* | "button" */
      | 'checkbox'
      | 'color'
      | 'date'
      | 'datetime-local'
      | 'email'
      | 'file'
      | 'hidden'
      /* | 'image' */
      | 'month'
      | 'number'
      | 'password'
      | 'radio'
      /* | "range" */
      /* | "reset" */
      | 'search'
      /* | "submit" */
      | 'tel'
      | 'text'
      | 'time'
      | 'url'
      | 'week';
    /**
     * Defines the width of `Input` in count of characters.
     */
    size?: number;
    /**
     * Disables element
     * @note Avoid using if possible for accessibility purposes
     */
    disabled?: boolean;
    /**
     * Toggle `readOnly`
     **/
    readOnly?: boolean;
    /**
     * Set role, i.e. `switch` when `checkbox` or `radio`
     **/
    role?: InputAttr['role'];
    /**
     * Indeterminate state for checkbox inputs
     * Only works when used inside `Field` component
     * @default false
     **/
    'data-indeterminate'?: boolean;
  }
>;

/**
 * Input renders a native `input` element.
 *
 * @example
 * <Input />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      className={cl(`ds-input`, className)}
      type='text' // Will be overwritten by rest if defined
      ref={ref}
      {...rest}
    />
  );
});
