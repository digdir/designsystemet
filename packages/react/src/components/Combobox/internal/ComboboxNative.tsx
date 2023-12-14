import React, { useContext } from 'react';

import { ComboboxContext } from '../Combobox';
export const ComboboxNative = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { selectedOptions, multiple, name } = context;

  return (
    <select
      name={name}
      multiple={multiple}
      style={{ display: 'none' }}
      value={selectedOptions.map((option) => option.value)}
      onChange={() => {}}
    >
      {selectedOptions.map((option) => (
        <option
          key={option.value}
          value={option.value}
        />
      ))}
    </select>
  );
};

export default ComboboxNative;
