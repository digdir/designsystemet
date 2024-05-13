import { forwardRef, memo, useContext, useId } from 'react';
import type * as React from 'react';
import cl from 'clsx/lite';

import { Label } from '../../../Typography';
import { omit } from '../../../../utilities';
import { ComboboxContext } from '../ComboboxContext';

import { SelectedIcon } from './SelectedIcon';
import ComboboxOptionDescription from './Description';
import useComboboxOption from './useComboboxOption';

export type ComboboxOptionProps = {
  /**
   * The value returned when the option is selected
   */
  value: string;
  /**
   * The index of the option in the list, will be overwritten by Combobox.
   */
  description?: string;
  /**
   * The text displayed in the input or in the chips when the option is selected.
   * Required if children is not composed of strings only.
   */
  displayValue?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ComboboxOption = memo(
  forwardRef<HTMLButtonElement, ComboboxOptionProps>(
    ({ value, description, children, className, ...rest }, forwardedRef) => {
      const labelId = useId();

      const { id, ref, selected, active, onOptionClick } = useComboboxOption({
        id: rest.id,
        ref: forwardedRef,
        value,
      });

      const context = useContext(ComboboxContext);
      if (!context) {
        throw new Error('ComboboxOption must be used within a Combobox');
      }
      const { size, multiple, getItemProps } = context;

      const props = getItemProps();

      return (
        <button
          ref={ref}
          id={id}
          role='option'
          type='button'
          aria-selected={!!selected}
          aria-labelledby={labelId}
          tabIndex={-1}
          onClick={(e) => {
            onOptionClick();
            rest.onClick?.(e);
          }}
          className={cl(
            'fds-combobox__option',
            `fds-combobox__option--${size}`,
            active && 'fds-combobox__option--active',
            multiple && 'fds-combobox__option--multiple',
            className,
          )}
          {...omit(['displayValue'], rest)}
          {...omit(['onClick', 'onPointerLeave'], props)}
        >
          <Label
            asChild
            size={size}
          >
            <span>
              <SelectedIcon
                multiple={multiple}
                selected={!!selected}
              />
            </span>
          </Label>
          <Label
            className={'fds-combobox__option__label'}
            size={size}
            id={labelId}
          >
            {children}
            {description && (
              <ComboboxOptionDescription>
                {description}
              </ComboboxOptionDescription>
            )}
          </Label>
        </button>
      );
    },
  ),
);

ComboboxOption.displayName = 'ComboboxOption';
