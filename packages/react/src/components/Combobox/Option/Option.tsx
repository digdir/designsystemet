import React, { forwardRef, useContext, useEffect, useId } from 'react';
import cn from 'classnames';

import { ComboboxContext } from '../Combobox';
import { Checkbox } from '../../form/Checkbox/Checkbox';
import { Label } from '../../Typography';

import classes from './Option.module.css';
import ComboboxOptionDescription from './Description/Description';

export type ComboboxOptionProps = {
  /**
   * The value returned when the item is selected
   */
  value: string;
  /**
   * The index of the item in the list, will be overwritten by Combobox.
   */
  index?: number;
  /**
   * The description of the item, will be displayed below the item text
   */
  description?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ComboboxOption = forwardRef<
  HTMLButtonElement,
  ComboboxOptionProps
>(({ value, index, description, children, ...rest }, ref) => {
  const labelId = useId();
  const generatedId = useId();

  const buttonId = rest.id || generatedId;

  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error('ComboboxOption must be used within a Combobox');
  }
  const {
    activeValues,
    activeIndex,
    setActiveItem,
    onItemClick,
    multiple,
    size,
  } = context;

  if (typeof index !== 'number') {
    throw new Error('Internal error: ComboboxOption did not receive index');
  }

  const active = activeValues.find((item) => item.value === value);

  useEffect(() => {
    if (activeIndex === index) setActiveItem(index, buttonId);
  }, [activeIndex, index, setActiveItem, buttonId]);

  return (
    <button
      {...rest}
      id={buttonId}
      role='option'
      aria-selected={activeIndex === index}
      aria-labelledby={labelId}
      onClick={() => {
        onItemClick(value);
      }}
      onMouseEnter={() => setActiveItem(index, labelId)} // Set active index on hover
      onFocus={() => setActiveItem(index, labelId)} // Set active index on focus
      className={cn(classes.item, activeIndex === index && classes.active)}
      ref={ref}
    >
      {multiple && (
        <Checkbox
          size={size}
          checked={!!active}
          value={value}
          className={classes.checkbox}
        />
      )}
      <Label
        className={classes.itemText}
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
