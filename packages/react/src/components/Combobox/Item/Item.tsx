import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';

import { ComboboxContext } from '../Combobox';
import { Checkbox } from '../../form/Checkbox/Checkbox';

import classes from './Item.module.css';

export type ComboboxItemProps = {
  value: string;
  index?: number;
  children: React.ReactNode;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ComboboxItem = forwardRef<HTMLButtonElement, ComboboxItemProps>(
  ({ value, index, children }, ref) => {
    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxItem must be used within a Combobox');
    }
    const {
      activeValues,
      activeIndex,
      setActiveIndex,
      onItemClick,
      multiple,
      size,
    } = context;

    if (typeof index !== 'number') {
      throw new Error('Internal error: ComboboxItem did not receive index');
    }

    const active = activeValues.find((item) => item.value === value);

    return (
      <button
        onClick={() => {
          onItemClick(value);
        }}
        onMouseEnter={() => setActiveIndex(index)} // Set active index on hover
        className={cn(classes.item, activeIndex === index && classes.active)}
        ref={ref}
      >
        {multiple && (
          <Checkbox
            size={size}
            checked={!!active}
            value={''}
          />
        )}
        <div className={classes.itemText}>{children}</div>
      </button>
    );
  },
);

ComboboxItem.displayName = 'ComboboxItem';
