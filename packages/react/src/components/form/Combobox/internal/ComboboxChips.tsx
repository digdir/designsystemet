import { useContext } from 'react';

import { ChipRemovable } from '../../../Chip';
import { ComboboxContext } from '../ComboboxContext';

const ComboboxChips = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const {
    size,
    readOnly,
    disabled,
    selectedOptions,
    chipSrLabel,
    handleSelectOption,
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
                handleSelectOption({
                  option: selectedOptions[value],
                  remove: true,
                });
                inputRef.current?.focus();
              }
            }}
            onClick={() => {
              if (readOnly) return;
              if (disabled) return;
              /* If we click a chip, filter the active values and remove the one we clicked */
              handleSelectOption({
                option: selectedOptions[value],
                remove: true,
              });
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
