import type {
  UseFloatingReturn,
  UseListNavigationProps,
  useInteractions,
} from '@floating-ui/react';
import { createContext } from 'react';

import type { useFormField } from '../useFormField';

import type { ComboboxProps } from './Combobox';
import type { Option } from './useCombobox';
import type useCombobox from './useCombobox';

type ComboboxContextType = {
  multiple: NonNullable<ComboboxProps['multiple']>;
  disabled: NonNullable<ComboboxProps['disabled']>;
  readOnly: NonNullable<ComboboxProps['readOnly']>;
  name: ComboboxProps['name'];
  error: ComboboxProps['error'];
  htmlSize: ComboboxProps['htmlSize'];
  hideChips: NonNullable<ComboboxProps['hideChips']>;
  clearButtonLabel: NonNullable<ComboboxProps['clearButtonLabel']>;
  hideClearButton: NonNullable<ComboboxProps['hideClearButton']>;
  filteredOptions: ReturnType<typeof useCombobox>['filteredOptions'];
  options: {
    [key: string]: Option;
  };
  selectedOptions: {
    [key: string]: Option;
  };
  size: NonNullable<ComboboxProps['size']>;
  formFieldProps: ReturnType<typeof useFormField>;
  refs: UseFloatingReturn['refs'];
  inputRef: React.RefObject<HTMLInputElement>;
  open: boolean;
  inputValue: string;
  optionValues: string[];
  listId: string;
  customIds: string[];
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setOpen: (open: boolean) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  getReferenceProps: (
    props?: Record<string, unknown>,
  ) => Record<string, unknown>;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  onOptionClick: (value: string) => void;
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<{
      [key: string]: Option;
    }>
  >;
  chipSrLabel: NonNullable<ComboboxProps['chipSrLabel']>;
  handleSelectOption: (option: Option) => void;
  listRef: UseListNavigationProps['listRef'];
  forwareddRef: React.Ref<HTMLInputElement>;
};

export const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);
