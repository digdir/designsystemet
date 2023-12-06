import React, { useContext } from 'react';

import { ChipRemovable } from '../../Chip';
import { ComboboxContext } from '../Combobox';

export const ComboboxChips = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { size, readOnly, disabled, activeValues, setActiveValues } = context;

  return (
    <>
      {activeValues.map((item) => {
        return (
          <ChipRemovable
            key={item.value}
            size={size}
            onClick={() => {
              if (readOnly) return;
              if (disabled) return;
              /* If we click a chip, filter the active values and remove the one we clicked */
              setActiveValues(
                activeValues.filter((i) => i.value !== item.value),
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
