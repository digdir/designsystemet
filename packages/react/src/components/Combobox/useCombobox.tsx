import React, { useEffect, useState } from 'react';

import type { ComboboxOptionProps } from './Option/Option';
import { ComboboxOption } from './Option/Option';

export type UseComboboxProps = {
  children: React.ReactNode;
  inputValue: string;
  multiple: boolean;
  activeOptions: Option[];
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
  filter,
}: UseComboboxProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Option[]>([]);

  // Update all values
  useEffect(() => {
    const allValues: Option[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === ComboboxOption) {
        const props = child.props as ComboboxOptionProps;

        let label = '';
        // get label from children, but only the string
        React.Children.forEach(props.children, (child) => {
          if (typeof child === 'string') {
            label += child;
          }
        });

        allValues.push({
          value: props.value,
          label,
        });
      }
    });
    const allValuesSet = allValues;
    setValues(allValuesSet);
  }, [children]);

  const getComboboxOptions = () => {
    const valuesArray = Array.from(values);
    const childrenArr = React.Children.toArray(children).filter((child) => {
      if (!React.isValidElement(child)) return false;
      if (child.type !== ComboboxOption) return false;
      return true;
    });

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
  };

  const getRestChildren = () => {
    const childrenArr = React.Children.toArray(children);

    return childrenArr.filter((child) => {
      return React.isValidElement(child) && child.type !== ComboboxOption;
    });
  };

  // Get children of type `ComboboxOption` and add index to props
  const filteredItems = getComboboxOptions().map((child, index) => {
    if (!React.isValidElement(child) || child.type !== ComboboxOption)
      return child;

    const props: ComboboxOptionProps = {
      ...(child.props as ComboboxOptionProps),
      index,
    } as ComboboxOptionProps;

    return React.cloneElement(child, props);
  });

  const restChildren = getRestChildren();

  const getShowEmptyChild = () => {
    // check if inputValue does not match any values
    if (inputValue === '') return false;

    // check if inputValue will show any values
    let activeValue;
    for (const item of values) {
      if (filter(inputValue, item.label, item.value)) {
        activeValue = item;
        break;
      }
    }

    if (!activeValue) return true;

    return false;
  };

  const showEmptyChild = getShowEmptyChild();

  return {
    filteredItems,
    restChildren,
    showEmptyChild,
    values,
    open,
    setOpen,
  };
}
