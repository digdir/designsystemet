import React, { useEffect, useState } from 'react';

import type { ComboboxItemProps } from './Item/Item';
import { ComboboxItem } from './Item/Item';

export type UseComboboxProps = {
  children: React.ReactNode;
  input: string;
  multiple: boolean;
  activeValues: ValueItemType[];
  filterFn: (inputValue: string, value: string) => boolean;
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
    // add index to children
    const indexedChildren = React.Children.toArray(children).map(
      (child, index) => {
        if (!React.isValidElement(child)) return child;
        if (child.type !== ComboboxItem) return child;

        const props: ComboboxItemProps = {
          ...child.props,
          index,
        } as ComboboxItemProps;
        return React.cloneElement(child, props);
      },
    );

    const activeValue = values.find((item) => item.label === input);
    // if input has a value that matches a value in the list, show all items
    if (activeValue && values.find((item) => item === activeValue)) {
      return indexedChildren;
    }

    if (input === '' && !multiple) return indexedChildren;

    return indexedChildren.filter((child) => {
      if (!React.isValidElement(child)) return false;
      if (child.type !== ComboboxItem) return true;
      const props = child.props as ComboboxItemProps;

      if (multiple && activeValues.find((item) => item.value === props.value))
        return false;

      const value = props.value as string;
      const item = values.find((item) => item.value === value);

      return filterFn(input, item?.label || '');
    });
  };

  const filteredChildren = GET_CHILDREN();

  console.log(activeValues);

  return {
    filteredChildren,
    values,
    open,
    setOpen,
  };
}
