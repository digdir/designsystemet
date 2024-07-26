import type {
  UseFloatingReturn,
  UseListNavigationProps,
  useInteractions,
} from '@floating-ui/react';
import { createContext } from 'react';

import type { useFormField } from '../useFormField';

import type { ComboboxProps } from './Combobox';
import type { Option } from './useCombobox';
import type { useCombobox } from './useCombobox';

export type ComboboxContextType = {
  multiple: NonNullable<ComboboxProps['multiple']>;
  disabled: NonNullable<ComboboxProps['disabled']>;
  readOnly: NonNullable<ComboboxProps['readOnly']>;
  htmlSize: ComboboxProps['htmlSize'];
  clearButtonLabel: NonNullable<ComboboxProps['clearButtonLabel']>;
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
  customIds: string[];
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setOpen: (open: boolean) => void;
  getReferenceProps: (
    props?: Record<string, unknown>,
  ) => Record<string, unknown>;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  onOptionClick: (value: string) => void;
  chipSrLabel: NonNullable<ComboboxProps['chipSrLabel']>;
  handleSelectOption: (args: {
    option: Option | null;
    remove?: boolean;
    clear?: boolean;
  }) => void;
  listRef: UseListNavigationProps['listRef'];
  forwareddRef: React.Ref<HTMLInputElement>;
  setListRef: (index: number, ref: HTMLElement | null) => void;
};

export const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);
