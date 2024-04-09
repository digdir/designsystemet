import { type ReactNode } from 'react';

import useDebounce from '../../../utilities/useDebounce';

import type useCombobox from './useCombobox';
import { isInteractiveComboboxCustom } from './useCombobox';
import type { Option } from './useCombobox';
import { useComboboxId } from './ComboboxIdContext';

type UseComboboxKeyboardProps = {
  customIds: string[];
  filteredOptions: ReturnType<typeof useCombobox>['filteredOptions'];
  selectedOptions: ReturnType<typeof useCombobox>['selectedOptions'];
  readOnly: boolean;
  disabled: boolean;
  restChildren: ReactNode[];
  inputValue: string;
  multiple: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  setSelectedOptions: ReturnType<typeof useCombobox>['setSelectedOptions'];
  setInputValue: (value: string) => void;
  handleSelectOption: (option: Option) => void;
};

export const useComboboxKeyboard = ({
  customIds,
  readOnly,
  disabled,
  restChildren,
  filteredOptions,
  inputValue,
  selectedOptions,
  multiple,
  open,
  setOpen,
  setInputValue,
  setSelectedOptions,
  handleSelectOption,
}: UseComboboxKeyboardProps) => {
  const { activeIndex } = useComboboxId();

  // handle keyboard navigation in the list
  const handleKeyDownFunc = (event: React.KeyboardEvent) => {
    if (readOnly || disabled) return;
    if (!event) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setOpen(true);
        }

        break;
      case 'ArrowUp':
        event.preventDefault();
        /* If we are on the first item, close */
        if (activeIndex === 0) {
          setOpen(false);
        }

        break;
      case 'Enter':
        event.preventDefault();
        if (open && (filteredOptions[activeIndex] || customIds.length > 0)) {
          // check if we are in the custom components
          if (activeIndex <= customIds.length) {
            // send `onSelect` event to the custom component
            const selectedId = customIds[activeIndex];
            const selectedComponent = restChildren.find(
              (component) =>
                isInteractiveComboboxCustom(component) &&
                component.props?.id === selectedId,
            );

            if (
              isInteractiveComboboxCustom(selectedComponent) &&
              selectedComponent.props.onSelect
            ) {
              selectedComponent.props.onSelect();
            }
          }

          // if we are in the options, find the actual index
          const valueIndex = activeIndex - customIds.length;

          const option = filteredOptions[valueIndex];

          if (!multiple) {
            // check if option is already selected, if so, deselect it
            if (selectedOptions[option?.value]) {
              setSelectedOptions({});
              setInputValue('');
              return;
            }
          }

          handleSelectOption(option);
        }
        break;

      case 'Backspace':
        if (
          inputValue === '' &&
          multiple &&
          Object.keys(selectedOptions).length > 0
        ) {
          setSelectedOptions((prev) => {
            const updated = { ...prev };
            const keys = Object.keys(updated);
            delete updated[keys[keys.length - 1]];
            return updated;
          });
        }
        // if we are in single mode, we need to set activeValue to null
        if (!multiple) {
          setSelectedOptions({});
        }
        break;

      default:
        break;
    }
  };

  const handleKeyDown = useDebounce(handleKeyDownFunc, 20);

  return handleKeyDown;
};
