import { useContext, useEffect, useId, useMemo } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { ComboboxContext } from '../ComboboxContext';
import useDebounce from '../../../../utilities/useDebounce';
import { useComboboxId, useComboboxIdDispatch } from '../ComboboxIdContext';

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
  const dispatch = useComboboxIdDispatch();
  if (!context) {
    throw new Error('ComboboxOption must be used within a Combobox');
  }
  const {
    selectedOptions,
    onOptionClick,
    listRef,
    optionValues,
    readOnly,
    disabled,
  } = context;

  const index = useMemo(
    () => optionValues.indexOf(value),
    [optionValues, value],
  );

  const setActiveOption = (index: number, id: string) => {
    if (readOnly) return;
    if (disabled) return;
    dispatch?.({ type: 'SET_ACTIVE_INDEX', payload: index });
    dispatch?.({ type: 'SET_ACTIVE_DESCENDANT', payload: id });
  };

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
  const active = activeIndex === index;

  useEffect(() => {
    console.log('option effect');
    if (active) {
      dispatch?.({ type: 'SET_ACTIVE_INDEX', payload: index });
      dispatch?.({ type: 'SET_ACTIVE_DESCENDANT', payload: id });
    }
  }, [generatedId, id, dispatch, active, index]);

  const onOptionClickDebounced = useDebounce(() => onOptionClick(value), 50);

  return {
    id,
    ref: combinedRef,
    selected,
    active,
    index,
    onOptionClick: onOptionClickDebounced,
    setActiveOption,
  };
}
