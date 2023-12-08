import React, { useEffect, useState } from 'react';

import type { ComboboxOptionProps } from './Option/Option';
import { ComboboxOption } from './Option/Option';

export type UseComboboxProps = {
  children: React.ReactNode;
  input: string;
  multiple: boolean;
  activeOptions: ValueItemType[];
  filter: (inputValue: string, label: string, value: string) => boolean;
};

export type ValueItemType = {
  value: string;
  label: string;
};

export default function useCombobox({
  children,
  input,
  multiple,
  filter,
}: UseComboboxProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Set<ValueItemType>>(new Set([]));

  // Update all values
  useEffect(() => {
    const allValues: ValueItemType[] = [];
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
    const allValuesSet = new Set(allValues);
    setValues(allValuesSet);
  }, [children]);

  const getComboboxOptions = () => {
    const valuesArray = Array.from(values);
    const childrenArr = React.Children.toArray(children).filter((child) => {
      if (!React.isValidElement(child)) return false;
      if (child.type !== ComboboxOption) return false;
      return true;
    });

    const activeValue = valuesArray.find((item) => item.label === input);
    if (activeValue && !multiple) {
      return childrenArr;
    }

    if (input === '' && !multiple) return childrenArr;

    return childrenArr.filter((child) => {
      if (!React.isValidElement(child)) return false;
      if (child.type !== ComboboxOption) return false;
      const props = child.props as ComboboxOptionProps;

      const value = props.value as string;
      const item = valuesArray.find((item) => item.value === value);

      return filter(input, item?.label || '', value);
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
    // check if input does not match any values
    if (input === '') return false;

    // check if input will show any values
    let activeValue;
    for (const item of values) {
      if (filter(input, item.label, item.value)) {
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
