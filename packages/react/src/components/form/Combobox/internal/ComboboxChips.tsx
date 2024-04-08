import { useContext } from 'react';

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
    inputRef,
  } = context;

  return (
    <>
      {Object.keys(selectedOptions).map((value) => {
        return (
          <ChipRemovable
            key={value}
            size={size}
            disabled={disabled}
            onKeyDown={(e) => {
              if (readOnly) return;
              if (disabled) return;
              if (e.key === 'Enter') {
                e.stopPropagation();
                setSelectedOptions((prev) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { [value]: _, ...rest } = prev;
                  return rest;
                });
                inputRef.current?.focus();
              }
            }}
            onClick={() => {
              if (readOnly) return;
              if (disabled) return;
              /* If we click a chip, filter the active values and remove the one we clicked */
              setSelectedOptions((prev) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [value]: _, ...rest } = prev;
                return rest;
              });
            }}
            style={{
              /* We already set the opacity on Combobox */
              opacity: 1,
            }}
            aria-label={chipSrLabel(selectedOptions[value])}
          >
            {selectedOptions[value].label}
          </ChipRemovable>
        );
      })}
    </>
  );
};

ComboboxChips.displayName = 'ComboboxChips';

export default ComboboxChips;
