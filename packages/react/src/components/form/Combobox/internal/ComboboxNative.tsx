import type { Option } from '../useCombobox';
import type { ComboboxProps } from '../Combobox';

type ComboboxNativeProps = {
  selectedOptions: Option[];
  multiple: NonNullable<ComboboxProps['multiple']>;
  name: ComboboxProps['name'];
};

export const ComboboxNative = ({ selectedOptions, multiple, name }: ComboboxNativeProps) => {
  return (
    <select
      name={name}
      multiple={multiple}
      style={{ display: 'none' }}
      value={multiple ? selectedOptions.map((option) => option.value) : selectedOptions[0]?.value}
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

ComboboxNative.displayName = 'ComboboxNative';

export default ComboboxNative;
