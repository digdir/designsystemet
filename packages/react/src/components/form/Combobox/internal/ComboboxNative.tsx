import type { Option } from '../useCombobox';
import type { ComboboxProps } from '../Combobox';
import { INTERNAL_OPT_PREFIX } from '../useCombobox';

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
  const VALUE = Object.keys(selectedOptions).map((key) =>
    key.slice(INTERNAL_OPT_PREFIX.length),
  );

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
