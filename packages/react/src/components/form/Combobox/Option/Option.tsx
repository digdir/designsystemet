import { forwardRef, memo, useContext, useId } from 'react';
import type * as React from 'react';
import cl from 'clsx';

import { Label } from '../../../Typography';
import { omit } from '../../../../utilities';
import { ComboboxContext } from '../ComboboxContext';

import { SelectedIcon } from './Icon/SelectedIcon';
import classes from './Option.module.css';
import ComboboxOptionDescription from './Description/Description';
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

      const {
        id,
        ref,
        selected,
        index,
        active,
        onOptionClick,
        setActiveOption,
      } = useComboboxOption({
        restId: rest.id,
        ref: forwardedRef,
        value,
      });

      const context = useContext(ComboboxContext);
      if (!context) {
        throw new Error('ComboboxOption must be used within a Combobox');
      }
      const { size, multiple } = context;

      return (
        <button
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
          onMouseEnter={(e) => {
            setActiveOption(index, labelId);
            rest.onMouseEnter?.(e);
          }} // Set active index on hover
          onFocus={(e) => {
            setActiveOption(index, labelId);
            rest.onFocus?.(e);
          }} // Set active index on focus
          className={cl(
            classes.option,
            classes[size],
            active && classes.active,
            multiple && classes.multiple,
            className,
          )}
          ref={ref}
          {...omit(['displayValue'], rest)}
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
            className={classes.optionText}
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
