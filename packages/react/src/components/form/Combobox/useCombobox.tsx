import { useMemo, Children, useState, isValidElement } from 'react';
import type { ReactNode, ReactElement } from 'react';

import type { ComboboxOptionProps } from './Option/Option';
import { ComboboxOption } from './Option/Option';
import type { ComboboxProps } from './Combobox';
import type { ComboboxCustomProps } from './Custom/Custom';
import ComboboxCustom from './Custom/Custom';

export type UseComboboxProps = {
  children: ReactNode;
  inputValue: string;
  multiple: boolean;
  filter: NonNullable<ComboboxProps['filter']>;
  initialValue?: string[];
};

export type Option = {
  value: string;
  label: string;
  displayValue?: string;
  description?: string;
};

const isOption = (option: Option | undefined): option is Option => !!option;

export function isComboboxOption(
  child: ReactNode,
): child is ReactElement<ComboboxOptionProps> {
  return isValidElement(child) && child.type === ComboboxOption;
}

export function isComboboxCustom(
  child: ReactNode,
): child is ReactElement<ComboboxCustomProps> {
  return isValidElement(child) && child.type === ComboboxCustom;
}

export function isInteractiveComboboxCustom(
  child: ReactNode,
): child is ReactElement<ComboboxCustomProps> {
  return isComboboxCustom(child) && child.props.interactive === true;
}

export default function useCombobox({
  children,
  inputValue,
  multiple,
  filter,
  initialValue,
}: UseComboboxProps) {
  const options = useMemo(() => {
    console.log('useMemo options ran');
    const allOptions: Option[] = [];
    Children.forEach(children, (child) => {
      if (isComboboxOption(child)) {
        const props = child.props;
        let label = props.displayValue || '';

        if (!props.displayValue) {
          let childrenLabel = '';

          // go over children and find all strings
          Children.forEach(props.children, (child) => {
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

  const preSelectedOptions = (initialValue || [])
    .map((value) => options.find((option) => option.value === value))
    .filter(isOption);

  const [selectedOptions, setSelectedOptions] =
    useState<Option[]>(preSelectedOptions);

  const [prevSelectedHash, setPrevSelectedHash] = useState(
    JSON.stringify(selectedOptions),
  );
  const optionsChildren = useMemo(() => {
    console.log('useMemo optionsChildren ran');
    const valuesArray = Array.from(options);
    const children_ = Children.toArray(children).filter((child) =>
      isComboboxOption(child),
    ) as ReactElement<ComboboxOptionProps>[];

    const activeValue = valuesArray.find((item) => item.label === inputValue);

    if (activeValue && !multiple) return children_;
    if (inputValue === '' && !multiple) return children_;

    return children_.filter((child) => {
      const { value } = child.props;

      const option = valuesArray.find((item) => item.value === value);

      if (!option) return false;

      const isSelected = selectedOptions.some(
        (selectedOption) => selectedOption.value === value,
      );

      // show what we search for, and all selected options
      return filter(inputValue, { ...option }) || isSelected;
    });
  }, [options, children, multiple, inputValue, selectedOptions, filter]);

  const customIds = useMemo(() => {
    console.log('useMemo customIds ran');
    // find all custom components with `interactive=true` and generate random values for them
    const children_ = Children.toArray(children).filter((child) => {
      return isInteractiveComboboxCustom(child);
    }) as ReactElement<ComboboxCustomProps>[];

    // return all ids
    return children_.map((child) => {
      if (!child.props.id)
        throw new Error('If ComboboxCustom is interactive, it must have an id');

      return child.props.id;
    });
  }, [children]);

  const optionValues = useMemo(() => {
    // create an index map of values from optionsChildren
    const options = optionsChildren.map((child) => {
      const { value } = child.props;
      return value;
    });

    return [...customIds, ...options];
  }, [customIds, optionsChildren]);

  const restChildren = useMemo(() => {
    console.log('useMemo restChildren ran');
    return Children.toArray(children).filter((child) => {
      return !isComboboxOption(child);
    });
  }, [children]);

  return {
    optionsChildren,
    optionValues,
    restChildren,
    options,
    customIds,
    selectedOptions,
    setSelectedOptions,
    prevSelectedHash,
    setPrevSelectedHash,
  };
}
