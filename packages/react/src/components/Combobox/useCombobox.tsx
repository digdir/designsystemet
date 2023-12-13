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

  const optionsChildren = useMemo(() => {
    const valuesArray = Array.from(options);
    const children_ = React.Children.toArray(children).filter(
      (child) =>
        !(!React.isValidElement(child) || child.type !== ComboboxOption),
    );

    const activeValue = valuesArray.find((item) => item.label === inputValue);

    if (activeValue && !multiple) {
      return children_;
    }

    if (inputValue === '' && !multiple) return children_;

    const optionsChildren = children_.filter((child) => {
      const { value } = (child as ReactElement<ComboboxOptionProps>).props;

      const option = valuesArray.find((item) => item.value === value);

      if (!option) return false;
      return filter(inputValue, { ...option });
    });

    return optionsChildren;
  }, [options, children, inputValue, multiple, filter]);

  const optionValues = useMemo(() => {
    // create an index map of values from optionsChildren
    return React.Children.toArray(optionsChildren).map((child) => {
      const { value } = (child as ReactElement<ComboboxOptionProps>).props;
      return value;
    });
  }, [optionsChildren]);

  const restChildren = useMemo(() => {
    const childrenArr = React.Children.toArray(children);

    return childrenArr.filter((child) => {
      return React.isValidElement(child) && child.type !== ComboboxOption;
    });
  }, [children]);

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
