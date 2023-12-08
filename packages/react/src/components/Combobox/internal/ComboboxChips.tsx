import React, { useContext } from 'react';

import { ChipRemovable } from '../../Chip';
import { ComboboxContext } from '../Combobox';

export const ComboboxChips = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { size, readOnly, disabled, activeOptions, setActiveOptions } = context;

  return (
    <>
      {activeOptions.map((item) => {
        return (
          <ChipRemovable
            key={item.value}
            size={size}
            disabled={disabled}
            onClick={() => {
              if (readOnly) return;
              if (disabled) return;
              /* If we click a chip, filter the active values and remove the one we clicked */
              setActiveOptions(
                activeOptions.filter((i) => i.value !== item.value),
              );
            }}
          >
            {item.label}
          </ChipRemovable>
        );
      })}
    </>
  );
};

export default ComboboxChips;
