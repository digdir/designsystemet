import React, { forwardRef } from 'react';

import { Button } from '../../Button';
import { ComboboxContext } from '../Combobox';

export type ComboboxItemProps = {
  value: string;
  index?: number;
  children: React.ReactNode;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ComboboxItem = forwardRef<HTMLButtonElement, ComboboxItemProps>(
  ({ value, index, children }, ref) => {
    const context = React.useContext(ComboboxContext);
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
        style={{
          justifyContent: 'start',
          backgroundColor:
            activeIndex === index
              ? 'var(--fds-semantic-surface-action-first-no_fill-hover)'
              : '',
        }}
        ref={ref}
      >
        {children}
      </Button>
    );
  },
);

ComboboxItem.displayName = 'ComboboxItem';
