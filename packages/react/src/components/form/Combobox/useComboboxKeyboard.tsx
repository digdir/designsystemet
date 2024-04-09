import { useContext, type ReactNode } from 'react';

import useDebounce from '../../../utilities/useDebounce';

import type useCombobox from './useCombobox';
import { isInteractiveComboboxCustom } from './useCombobox';
import type { Option } from './useCombobox';
import { ComboboxIdContext, ComboboxIdDispatch } from './ComboboxIdContext';

type UseComboboxKeyboardProps = {
  customIds: string[];
  options: ReturnType<typeof useCombobox>['options'];
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
  options,
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
  console.log('useComboboxKeyboard');

  const context = useContext(ComboboxIdContext);
  console.log({
    context,
  });
  const dispatch = useContext(ComboboxIdDispatch);
  const { activeIndex } = context;

  // handle keyboard navigation in the list
  const handleKeyDownFunc = (event: React.KeyboardEvent) => {
    const navigatable = customIds.length + Object.keys(options).length;

    if (readOnly || disabled) return;
    if (!event) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          dispatch?.({ type: 'SET_ACTIVE_INDEX', payload: 0 });
        } else {
          dispatch?.({
            type: 'SET_ACTIVE_INDEX',
            payload: Math.min(activeIndex + 1, navigatable - 1),
          });
        }

        break;
      case 'ArrowUp':
        event.preventDefault();
        /* If we are on the first item, close */

        if (activeIndex === 0) {
          setOpen(false);
          dispatch?.({ type: 'SET_ACTIVE_INDEX', payload: 0 });
        }

        dispatch?.({
          type: 'SET_ACTIVE_INDEX',
          payload: Math.max(activeIndex - 1, 0),
        });

        break;
      case 'Enter':
        event.preventDefault();
        if (open && (filteredOptions[activeIndex] || customIds.length > 0)) {
          console.log('in here');
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
