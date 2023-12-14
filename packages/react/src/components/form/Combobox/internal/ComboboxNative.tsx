import React from 'react';

import type { Option } from '../useCombobox';
import type { ComboboxProps } from '../Combobox';

type ComboboxNativeProps = {
  selectedOptions: Option[];
  multiple: ComboboxProps['multiple'];
  name: ComboboxProps['name'];
};

export const ComboboxNative = ({
  selectedOptions,
  multiple,
  name,
}: ComboboxNativeProps) => {
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
