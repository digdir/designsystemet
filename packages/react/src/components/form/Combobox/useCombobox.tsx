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
  filter?: NonNullable<ComboboxProps['filter']>;
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
  filter = (inputValue, option) => {
    return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
  },
  initialValue,
}: UseComboboxProps) {
  const { optionsChildren, customIds } = useMemo(() => {
    const allChildren = Children.toArray(children);
    const optionsChildren = allChildren.filter((child) =>
      isComboboxOption(child),
    ) as ReactElement<ComboboxOptionProps>[];

    // find all custom components with `interactive=true`
    const customChildren = allChildren.filter((child) => {
      return isInteractiveComboboxCustom(child);
    }) as ReactElement<ComboboxCustomProps>[];

    // return all ids
    const customIds = customChildren.map((child) => {
      if (!child.props.id)
        throw new Error('If ComboboxCustom is interactive, it must have an id');

      return child.props.id;
    });

    return { optionsChildren, customIds };
  }, [children]);

  const options = useMemo(() => {
    const allOptions: {
      [key: string]: Option;
    } = {};
    optionsChildren.map((child) => {
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

      allOptions[props.value] = {
        value: props.value,
        label,
        displayValue: props.displayValue,
        description: props.description,
      };
    });

    return allOptions;
  }, [optionsChildren]);

  const preSelectedOptions = useMemo(
    () =>
      (initialValue || []).reduce<{
        [key: string]: Option;
      }>((acc, value) => {
        const option = options[value];
        if (isOption(option)) {
          acc[value] = option;
        }
        return acc;
      }, {}),
    [initialValue, options],
  );

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: Option;
  }>(preSelectedOptions);

  const [prevSelectedHash, setPrevSelectedHash] = useState(
    JSON.stringify(selectedOptions),
  );

  const { filteredOptions, filteredOptionsChildren } = useMemo(() => {
    const filteredOptions: string[] = [];

    const filteredOptionsChildren = Object.keys(options)
      .map((option, index) => {
        if (multiple && selectedOptions[option]) {
          filteredOptions.push(options[option].value);
          return optionsChildren[index];
        }
        if (filter(inputValue, options[option])) {
          filteredOptions.push(options[option].value);
          return optionsChildren[index];
        }
      })
      .filter((child) => child);

    return { filteredOptions, filteredOptionsChildren };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, multiple, options, optionsChildren, selectedOptions]);

  const optionValues = useMemo(() => {
    // create an index map of values from optionsChildren
    const options = optionsChildren.map((child) => {
      const { value } = child.props;
      return value;
    });

    return [...customIds, ...options];
  }, [customIds, optionsChildren]);

  const { restChildren, interactiveChildren } = useMemo(() => {
    const restChildren = Children.toArray(children).filter((child) => {
      return !isComboboxOption(child);
    });

    const interactiveChildren: ReactElement<ComboboxCustomProps>[] =
      restChildren.filter((child) => {
        return isInteractiveComboboxCustom(child);
      }) as ReactElement<ComboboxCustomProps>[];

    return { restChildren, interactiveChildren };
  }, [children]);

  return {
    filteredOptionsChildren,
    filteredOptions,
    optionValues,
    restChildren,
    options,
    customIds,
    selectedOptions,
    prevSelectedHash,
    interactiveChildren,
    setSelectedOptions,
    setPrevSelectedHash,
  };
}
