import type { Option } from '../useCombobox';
import type { ComboboxProps } from '../Combobox';
import { removePrefix } from '../useCombobox';

type ComboboxNativeProps = {
  selectedOptions: {
    [key: string]: Option;
  };
  multiple: NonNullable<ComboboxProps['multiple']>;
  name: ComboboxProps['name'];
};

export const ComboboxNative = ({
  selectedOptions,
  multiple,
  name,
}: ComboboxNativeProps) => {
  const VALUE = Object.keys(selectedOptions).map((key) => removePrefix(key));

  return (
    <select
      name={name}
      multiple={multiple}
      style={{ display: 'none' }}
      value={multiple ? VALUE : VALUE[0]}
      onChange={() => {}}
    >
      {VALUE.map((value) => (
        <option
          key={value}
          value={value}
        />
      ))}
    </select>
  );
};

ComboboxNative.displayName = 'ComboboxNative';

export default ComboboxNative;
