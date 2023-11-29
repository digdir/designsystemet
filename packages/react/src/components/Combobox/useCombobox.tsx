import React, { useEffect, useState } from 'react';

import type { ComboboxItemProps } from './Item/Item';
import { ComboboxItem } from './Item/Item';
import ComboboxEmpty from './Empty/Empty';

export type UseComboboxProps = {
  children: React.ReactNode;
  input: string;
  multiple: boolean;
  activeValues: ValueItemType[];
  filterFn: (inputValue: string, label: string, value: string) => boolean;
};

export type ValueItemType = {
  value: string;
  label: string;
};

export default function useCombobox({
  children,
  input,
  multiple,
  activeValues,
  filterFn,
}: UseComboboxProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ValueItemType[]>([]);

  // Update all values
  useEffect(() => {
    const allValues: ValueItemType[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === ComboboxItem) {
        const props = child.props as ComboboxItemProps;
        allValues.push({
          value: props.value,
          label: props.children?.toString() as string,
        });
      }
    });
    setValues(allValues);
  }, [children]);

  const GET_CHILDREN = () => {
    const childrenArr = React.Children.toArray(children);

    const activeValue = values.find((item) => item.label === input);
    // if input has a value that matches a value in the list, show all items
    if (
      activeValue &&
      !multiple &&
      values.find((item) => item === activeValue)
    ) {
      return childrenArr;
    }

    if (input === '' && !multiple) return childrenArr;

    return childrenArr.filter((child) => {
      if (!React.isValidElement(child)) return false;
      if (child.type !== ComboboxItem) return true;
      const props = child.props as ComboboxItemProps;

      if (multiple && activeValues.find((item) => item.value === props.value))
        return false;

      const value = props.value as string;
      const item = values.find((item) => item.value === value);

      return filterFn(input, item?.label || '', value);
    });
  };

  const filteredChildren = GET_CHILDREN().map((child, index) => {
    if (!React.isValidElement(child)) return child;
    if (child.type !== ComboboxItem) return child;

    const props: ComboboxItemProps = {
      ...(child.props as ComboboxItemProps),
      index,
    } as ComboboxItemProps;
    return React.cloneElement(child, props);
  });

  const SHOW_EMPTY_CHILD = () => {
    // check if there are any values left to show
    if (values.length === activeValues.length) return true;
    // check if input does not match any values

    if (input === '') return false;

    // check if input will show any values
    const activeValue = values.find((item) =>
      item.label.toLowerCase().includes(input.toLowerCase()),
    );
    if (!activeValue) return true;

    return false;
  };

  const showEmptyChild = SHOW_EMPTY_CHILD();

  return {
    filteredChildren,
    showEmptyChild,
    values,
    open,
    setOpen,
  };
}
