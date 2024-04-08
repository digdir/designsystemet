import { forwardRef, useContext, useEffect, useId, useMemo } from 'react';
import type * as React from 'react';
import cl from 'clsx';
import { useMergeRefs } from '@floating-ui/react';

import { ComboboxContext } from '../Combobox';
import { Label } from '../../../Typography';
// import ComboboxCheckbox from '../internal/ComboboxCheckbox';
import { omit } from '../../../../utilities';
import useDebounce from '../../../../utilities/useDebounce';

import { SelectedIcon } from './Icon/SelectedIcon';
import classes from './Option.module.css';
import ComboboxOptionDescription from './Description/Description';

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

export const ComboboxOption = forwardRef<
  HTMLButtonElement,
  ComboboxOptionProps
>(({ value, description, children, className, ...rest }, ref) => {
  const labelId = useId();
  const generatedId = useId();

  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error('ComboboxOption must be used within a Combobox');
  }
  const {
    selectedOptions,
    activeIndex,
    setActiveOption,
    onOptionClick,
    size,
    listRef,
    optionValues,
    multiple,
  } = context;

  const index = useMemo(
    () => optionValues.indexOf(value),
    [optionValues, value],
  );

  const combinedRef = useMergeRefs([
    (node: HTMLElement | null) => {
      listRef.current[index] = node;
    },
    ref,
  ]);

  if (index === -1) {
    throw new Error('Internal error: ComboboxOption did not find index');
  }

  const selected = selectedOptions[value];

  useEffect(() => {
    if (activeIndex === index) setActiveOption(index, rest.id || generatedId);
  }, [activeIndex, generatedId, index, rest.id, setActiveOption]);

  const onOptionClickDebounced = useDebounce(() => onOptionClick(value), 50);

  console.log('option rendered');

  return (
    <button
      id={rest.id || generatedId}
      role='option'
      type='button'
      aria-selected={!!selected}
      aria-labelledby={labelId}
      tabIndex={-1}
      onClick={(e) => {
        onOptionClickDebounced();
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
        activeIndex === index && classes.active,
        multiple && classes.multiple,
        className,
      )}
      ref={combinedRef}
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
          <ComboboxOptionDescription>{description}</ComboboxOptionDescription>
        )}
      </Label>
    </button>
  );
});

ComboboxOption.displayName = 'ComboboxOption';
