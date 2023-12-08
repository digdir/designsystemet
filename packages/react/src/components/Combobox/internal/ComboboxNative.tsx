import React, { useContext } from 'react';

import { ComboboxContext } from '../Combobox';
export const ComboboxNative = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { activeOptions, multiple, name } = context;

  return (
    <select
      name={name}
      multiple={multiple}
      style={{ display: 'none' }}
      value={activeOptions.map((item) => item.value)}
      onChange={() => {}}
    >
      {activeOptions.map((item) => (
        <option
          key={item.value}
          value={item.value}
        />
      ))}
    </select>
  );
};

export default ComboboxNative;
