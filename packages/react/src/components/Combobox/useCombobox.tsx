import type { ReactElement } from 'react';
import React, { useMemo, useState } from 'react';

import type { ComboboxOptionProps } from './Option/Option';
import { ComboboxOption } from './Option/Option';
import type { ComboboxProps } from './Combobox';

export type UseComboboxProps = {
  children: React.ReactNode;
  inputValue: string;
  multiple: boolean;
  selectedOptions: Option[];
  filter: NonNullable<ComboboxProps['filter']>;
};

export type Option = {
  value: string;
  label: string;
  displayValue?: string;
  description?: string;
};

export default function useCombobox({
  children,
  inputValue,
  multiple,
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
          let childrenLabel = '';

          // go over children and find all string
          React.Children.forEach(props.children, (child) => {
            if (typeof child === 'string') {
              childrenLabel += child;
            } else {
              throw new Error(
                'if ComboboxOption is not a string, it must have a displayValue prop',
              );
            }
          });

          label = childrenLabel;
        }

        allOptions.push({
          value: props.value,
          label,
          displayValue: props.displayValue,
          description: props.description,
        });
      }
    });
    return allOptions;
  }, [children]);

  const filteredOptions = useMemo(() => {
    const valuesArray = Array.from(options);
    const children_ = React.Children.toArray(children).filter(
      (child) =>
        !(!React.isValidElement(child) || child.type !== ComboboxOption),
    );

    const activeValue = valuesArray.find((item) => item.label === inputValue);

    if (activeValue && !multiple) {
      return { optionsChildren: children_, optionValues: [] };
    }

    if (inputValue === '' && !multiple)
      return { optionsChildren: children_, optionValues: [] };

    const optionValues: string[] = [];
    const optionsChildren = children_.filter((child) => {
      const { value } = (child as ReactElement<ComboboxOptionProps>).props;

      const option = valuesArray.find((item) => item.value === value);

      if (!option) return false;
      if (!filter(inputValue, { ...option })) return false;

      optionValues.push(value);

      return true;
    });

    return { optionsChildren, optionValues };
  }, [options, children, inputValue, multiple, filter]);

  const { optionsChildren, optionValues } = filteredOptions;

  const restChildren = useMemo(() => {
    const childrenArr = React.Children.toArray(children);

    return childrenArr.filter((child) => {
      return React.isValidElement(child) && child.type !== ComboboxOption;
    });
  }, [children]);

  // Get children of type `ComboboxOption` and add index to props
  // const filteredItems = useMemo(() => {
  //   return optionsChildren.map((child, index) => {
  //     if (!React.isValidElement(child) || child.type !== ComboboxOption)
  //       return child;

  //     const props: ComboboxOptionProps = {
  //       ...(child.props as ComboboxOptionProps),
  //       index,
  //       ref(node: HTMLElement | null) {
  //         listRef.current[index] = node;
  //       },
  //     } as ComboboxOptionProps;

  //     return React.cloneElement(child, props);
  //   });
  // }, [optionsChildren, listRef]);

  const showEmptyChild = useMemo(() => {
    // check if inputValue does not match any values
    if (inputValue === '') return false;

    // check if inputValue will show any values
    let activeValue;
    for (const item of options) {
      if (filter(inputValue, { ...item })) {
        activeValue = item;
        break;
      }
    }

    if (!activeValue) return true;

    return false;
  }, [inputValue, options, filter]);

  return {
    optionsChildren,
    optionValues,
    restChildren,
    showEmptyChild,
    options,
    open,
    setOpen,
  };
}
