import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';

import type { ButtonProps } from '../../Button';
import { Button } from '../../Button';
import { ComboboxContext } from '../Combobox';

import classes from './Item.module.css';

export type ComboboxItemProps = {
  value: string;
  index?: number;
  children: React.ReactNode;
  active?: boolean;
} & React.ButtonHTMLAttributes<ButtonProps>;

export const ComboboxItem = forwardRef<ButtonProps, ComboboxItemProps>(
  ({ value, index, children }, ref) => {
    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxItem must be used within a Combobox');
    }
    const { activeIndex, setActiveIndex, onItemClick } = context;

    if (typeof index !== 'number') {
      throw new Error('Internal error: ComboboxItem did not receive index');
    }

    return (
      <Button
        fullWidth
        onClick={() => onItemClick(value)}
        onMouseEnter={() => setActiveIndex(index)} // Set active index on hover
        variant={activeIndex === index ? 'secondary' : 'tertiary'}
        className={cn(classes.item, activeIndex === index && classes.active)}
        ref={ref}
      >
        {children}
      </Button>
    );
  },
);

ComboboxItem.displayName = 'ComboboxItem';
