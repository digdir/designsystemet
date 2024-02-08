import { useMemo } from 'react';
import * as React from 'react';

import type { ComboboxOptionProps } from './Option/Option';
import { ComboboxOption } from './Option/Option';
import type { ComboboxProps } from './Combobox';
import type { ComboboxCustomProps } from './Custom/Custom';
import ComboboxCustom from './Custom/Custom';

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
  const options = useMemo(() => {
    const allOptions: Option[] = [];
    React.Children.forEach(children, (child) => {
      if (isComboboxOption(child)) {
        const props = child.props;
        let label = props.displayValue || '';

        if (!props.displayValue) {
          let childrenLabel = '';

          // go over children and find all strings
          React.Children.forEach(props.children, (child) => {
            if (typeof child === 'string') {
              childrenLabel += child;
            } else {
              throw new Error(
                'If ComboboxOption is not a string, it must have a displayValue prop',
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
    const children_ = React.Children.toArray(children).filter((child) =>
      isComboboxOption(child),
    ) as React.ReactElement<ComboboxOptionProps>[];

    const activeValue = valuesArray.find((item) => item.label === inputValue);

    if (activeValue && !multiple) return children_;
    if (inputValue === '' && !multiple) return children_;

    return children_.filter((child) => {
      const { value } = child.props;

      const option = valuesArray.find((item) => item.value === value);

      if (!option) return false;
      return filter(inputValue, { ...option });
    });
  }, [options, children, inputValue, multiple, filter]);

  const optionValues = useMemo(() => {
    // create an index map of values from optionsChildren
    return optionsChildren.map((child) => {
      const { value } = child.props;
      return value;
    });
  }, [optionsChildren]);

  const customRandomValues = useMemo(() => {
    // find all custom components with `interactive=true` and generate random values for them
    return React.Children.toArray(children)
      .filter((child) => {
        return isComboboxCustom(child) && child.props.interactive;
      })
      .map(() => Math.random().toString(36).substring(7));
  }, [children]);

  console.log(customRandomValues, 'customRandomValues');

  const restChildren = useMemo(() => {
    return React.Children.toArray(children).filter((child) => {
      return !isComboboxOption(child);
    });
  }, [children]);

  return {
    optionsChildren,
    optionValues,
    restChildren,
    options,
  };
}

export function isComboboxOption(
  child: React.ReactNode,
): child is React.ReactElement<ComboboxOptionProps> {
  return React.isValidElement(child) && child.type === ComboboxOption;
}

export function isComboboxCustom(
  child: React.ReactNode,
): child is React.ReactElement<ComboboxCustomProps> {
  return React.isValidElement(child) && child.type === ComboboxCustom;
}
