import React, { useMemo, useState } from 'react';

import type { ComboboxOptionProps } from './Option/Option';
import { ComboboxOption } from './Option/Option';

export type UseComboboxProps = {
  children: React.ReactNode;
  inputValue: string;
  multiple: boolean;
  selectedOptions: Option[];
  listRef: React.MutableRefObject<(HTMLElement | null)[]>;
  filter: (inputValue: string, label: string, value: string) => boolean;
};

export type Option = {
  value: string;
  label: string;
};

export default function useCombobox({
  children,
  inputValue,
  multiple,
  listRef,
  filter,
}: UseComboboxProps) {
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    const allOptions: Option[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === ComboboxOption) {
        const props = child.props as ComboboxOptionProps;
        let label = props.displayValue || '';

        if (!props.displayValue) {
          if (typeof props.children !== 'string') {
            throw new Error(
              'if ComboboxOption is not a string, it must have a displayValue prop',
            );
          }

          label = props.children;
        }

        allOptions.push({
          value: props.value,
          label,
        });
      }
    });
    return allOptions;
  }, [children]);

  const comboboxOptions = useMemo(() => {
    const valuesArray = Array.from(options);
    const childrenArr = React.Children.toArray(children).filter(
      (child) =>
        !(!React.isValidElement(child) || child.type !== ComboboxOption),
    );

    const activeValue = valuesArray.find((item) => item.label === inputValue);
    if (activeValue && !multiple) {
      return childrenArr;
    }

    if (inputValue === '' && !multiple) return childrenArr;

    return childrenArr.filter((child) => {
      if (!React.isValidElement(child)) return false;
      const props = child.props as ComboboxOptionProps;

      const value = props.value as string;
      const item = valuesArray.find((item) => item.value === value);

      return filter(inputValue, item?.label || '', value);
    });
  }, [options, children, inputValue, multiple, filter]);

  const restChildren = useMemo(() => {
    const childrenArr = React.Children.toArray(children);

    return childrenArr.filter((child) => {
      return React.isValidElement(child) && child.type !== ComboboxOption;
    });
  }, [children]);

  // Get children of type `ComboboxOption` and add index to props
  const filteredItems = useMemo(() => {
    return comboboxOptions.map((child, index) => {
      if (!React.isValidElement(child) || child.type !== ComboboxOption)
        return child;

      const props: ComboboxOptionProps = {
        ...(child.props as ComboboxOptionProps),
        index,
        ref(node: HTMLElement | null) {
          listRef.current[index] = node;
        },
      } as ComboboxOptionProps;

      return React.cloneElement(child, props);
    });
  }, [comboboxOptions, listRef]);

  const showEmptyChild = useMemo(() => {
    // check if inputValue does not match any values
    if (inputValue === '') return false;

    // check if inputValue will show any values
    let activeValue;
    for (const item of options) {
      if (filter(inputValue, item.label, item.value)) {
        activeValue = item;
        break;
      }
    }

    if (!activeValue) return true;

    return false;
  }, [inputValue, options, filter]);

  return {
    filteredItems,
    restChildren,
    showEmptyChild,
    options,
    open,
    setOpen,
  };
}
