import type { HTMLAttributes } from 'react';
import React, { forwardRef, useId } from 'react';

import { Button } from '../../Button';

export type ItemProps = {
  children: React.ReactNode;
  value: string;
  active?: boolean;
} & HTMLAttributes<HTMLElement>;

export const ComboboxItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error('ComboboxItem must be used within a Combobox');
  }
  const { activeIndex, onItemClick } = context;

  return (
    <div
      onClick={() => onItemClick(value)}
      style={{ backgroundColor: activeIndex === value ? 'lightgray' : 'white' }}
    >
      {children}
    </div>
  );
};
