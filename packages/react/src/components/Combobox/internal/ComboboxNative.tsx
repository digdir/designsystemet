import React, { useContext } from 'react';

import { ComboboxContext } from '../Combobox';
export const ComboboxNative = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('ComboboxContext is missing');
  }

  const { activeValues, multiple, name } = context;

  return (
    <select
      name={name || 'combobox'}
      multiple={multiple}
      style={{ display: 'none' }}
      value={activeValues.map((item) => item.value)}
      readOnly
    >
      {activeValues.map((item) => (
        <option
          key={item.value}
          value={item.value}
        />
      ))}
    </select>
  );
};

export default ComboboxNative;
