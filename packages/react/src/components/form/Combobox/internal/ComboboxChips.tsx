import { useContext } from 'react';

import { ChipRemovable } from '../../../Chip';
import { ComboboxContext } from '../Combobox';

export const ComboboxChips = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { size, readOnly, disabled, selectedOptions, setSelectedOptions, chipSrLabel, inputRef } = context;

  return (
    <>
      {selectedOptions.map((option) => {
        return (
          <ChipRemovable
            key={option.value}
            size={size}
            disabled={disabled}
            onKeyDown={(e) => {
              if (readOnly) return;
              if (disabled) return;
              if (e.key === 'Enter') {
                e.stopPropagation();
                setSelectedOptions(selectedOptions.filter((i) => i.value !== option.value));
                inputRef.current?.focus();
              }
            }}
            onClick={() => {
              if (readOnly) return;
              if (disabled) return;
              /* If we click a chip, filter the active values and remove the one we clicked */
              setSelectedOptions(selectedOptions.filter((i) => i.value !== option.value));
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

ComboboxChips.displayName = 'ComboboxChips';

export default ComboboxChips;
