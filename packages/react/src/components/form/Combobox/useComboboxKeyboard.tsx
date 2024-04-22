import useDebounce from '../../../utilities/useDebounce';

import type useCombobox from './useCombobox';
import type { Option } from './useCombobox';
import { useComboboxId } from './ComboboxIdContext';

type UseComboboxKeyboardProps = {
  filteredOptions: ReturnType<typeof useCombobox>['filteredOptions'];
  selectedOptions: ReturnType<typeof useCombobox>['selectedOptions'];
  interactiveChildren: ReturnType<typeof useCombobox>['interactiveChildren'];
  options: ReturnType<typeof useCombobox>['options'];
  readOnly: boolean;
  disabled: boolean;
  inputValue: string;
  multiple: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  setSelectedOptions: ReturnType<typeof useCombobox>['setSelectedOptions'];
  setInputValue: (value: string) => void;
  handleSelectOption: (option: Option) => void;
};

export const useComboboxKeyboard = ({
  readOnly,
  disabled,
  interactiveChildren,
  filteredOptions,
  inputValue,
  selectedOptions,
  multiple,
  open,
  options,
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
        // ignore if it is closed
        if (!open) break;

        // check if we are in the custom components
        if (activeIndex <= interactiveChildren.length - 1) {
          const selectedComponent = interactiveChildren[activeIndex];
          if (selectedComponent.props.onSelect) {
            selectedComponent?.props.onSelect();
            return;
          }
        }

        // if we are in the options, find the actual index
        // eslint-disable-next-line no-case-declarations
        const valueIndex = activeIndex - interactiveChildren.length;

        // eslint-disable-next-line no-case-declarations
        const option = filteredOptions[valueIndex];
        if (!multiple) {
          // check if option is already selected, if so, deselect it
          if (selectedOptions[option]) {
            setSelectedOptions({});
            setInputValue('');
            return;
          }
        }

        handleSelectOption(options[option]);
        break;

      case 'Backspace':
        if (
          inputValue === '' &&
          multiple &&
          Object.keys(selectedOptions).length >= 0
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
