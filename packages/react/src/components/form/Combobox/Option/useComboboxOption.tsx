import { useContext, useEffect, useId, useMemo } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { ComboboxContext } from '../ComboboxContext';
import useDebounce from '../../../../utilities/useDebounce';
import { useComboboxId } from '../ComboboxIdContext';

type UseComboboxOptionProps = {
  restId?: string;
  ref: React.Ref<HTMLButtonElement>;
  value: string;
};

export default function useComboboxOption({
  restId,
  ref,
  value,
}: UseComboboxOptionProps) {
  console.log('useComboboxOption');

  const generatedId = useId();
  const id = restId || generatedId;

  const context = useContext(ComboboxContext);
  const { activeIndex } = useComboboxId();
  if (!context) {
    throw new Error('ComboboxOption must be used within a Combobox');
  }
  const {
    selectedOptions,
    setActiveOption,
    onOptionClick,
    listRef,
    optionValues,
  } = context;

  const index = useMemo(
    () => optionValues.indexOf(value),
    [optionValues, value],
  );

  const combinedRef = useMergeRefs([
    (node: HTMLElement | null) => {
      listRef.current[index] = node;
    },
    ref,
  ]);

  if (index === -1) {
    throw new Error('Internal error: ComboboxOption did not find index');
  }

  const selected = selectedOptions[value];

  useEffect(() => {
    console.log('option effect');
    if (activeIndex === index) setActiveOption(index, id);
  }, [activeIndex, generatedId, index, id, setActiveOption]);

  const onOptionClickDebounced = useDebounce(() => onOptionClick(value), 50);

  return {
    id,
    ref: combinedRef,
    selected,
    index,
    onOptionClick: onOptionClickDebounced,
  };
}
