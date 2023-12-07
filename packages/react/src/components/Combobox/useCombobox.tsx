import React, { useEffect, useState } from 'react';

import type { ComboboxItemProps } from './Item/Item';
import { ComboboxItem } from './Item/Item';

export type UseComboboxProps = {
  children: React.ReactNode;
  input: string;
  multiple: boolean;
  activeValues: ValueItemType[];
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
      if (React.isValidElement(child) && child.type === ComboboxItem) {
        const props = child.props as ComboboxItemProps;

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

  const getComboboxItems = () => {
    const valuesArray = Array.from(values);
    const childrenArr = React.Children.toArray(children).filter((child) => {
      if (!React.isValidElement(child)) return false;
      if (child.type !== ComboboxItem) return false;
      return true;
    });

    const activeValue = valuesArray.find((item) => item.label === input);
    if (activeValue && !multiple) {
      return childrenArr;
    }

    if (input === '' && !multiple) return childrenArr;

    return childrenArr.filter((child) => {
      if (!React.isValidElement(child)) return false;
      if (child.type !== ComboboxItem) return false;
      const props = child.props as ComboboxItemProps;

      const value = props.value as string;
      const item = valuesArray.find((item) => item.value === value);

      return filter(input, item?.label || '', value);
    });
  };

  const getRestChildren = () => {
    const childrenArr = React.Children.toArray(children);

    return childrenArr.filter((child) => {
      return React.isValidElement(child) && child.type !== ComboboxItem;
    });
  };

  // Get children of type `ComboboxItem` and add index to props
  const filteredItems = getComboboxItems().map((child, index) => {
    if (!React.isValidElement(child) || child.type !== ComboboxItem)
      return child;

    const props: ComboboxItemProps = {
      ...(child.props as ComboboxItemProps),
      index,
    } as ComboboxItemProps;

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
