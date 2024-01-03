import React, { useContext } from 'react';

import { ChipRemovable } from '../../../Chip';
import { ComboboxContext } from '../Combobox';

export const ComboboxChips = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const {
    size,
    readOnly,
    disabled,
    selectedOptions,
    setSelectedOptions,
    chipSrLabel,
  } = context;

  return (
    <>
      {selectedOptions.map((option) => {
        return (
          <ChipRemovable
            key={option.value}
            size={size}
            disabled={disabled}
            onClick={() => {
              if (readOnly) return;
              if (disabled) return;
              /* If we click a chip, filter the active values and remove the one we clicked */
              setSelectedOptions(
                selectedOptions.filter((i) => i.value !== option.value),
              );
            }}
            style={{
              /* We already set the opacity on Combobox */
              opacity: 1,
            }}
            aria-label={chipSrLabel(option)}
          >
            {option.label}
          </ChipRemovable>
        );
      })}
    </>
  );
};

export default ComboboxChips;
