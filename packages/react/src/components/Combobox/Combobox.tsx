import type { ChangeEvent } from 'react';
import React, {
  forwardRef,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  autoUpdate,
  flip,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { size } from '@floating-ui/dom';

import type { LegacyTextFieldProps } from '../legacy/LegacyTextField';
import { LegacyTextField } from '../legacy/LegacyTextField';

import { ComboboxActionType, comboboxReducer } from './ComboboxReducer';
import { ComboboxList } from './ComboboxList';
import type { ComboboxFilter } from './types/ComboboxFilter';
import { defaultFilter } from './utils/defaultFilter';
import type { ComboboxOption } from './types/ComboboxOption';

export type ComboboxProps = {
  /**
   * Custom filter.
   * Use this to customise filtering and ordering of the options based on the input value.
   * */
  filter?: ComboboxFilter;

  /** Function that is called with the input value when it is selected from the option list. */
  onSelect?: (value: string) => void;

  /** The list of all available options. */
  options: ComboboxOption[];

  /** Placeholder text for the input field. */
  placeholder?: string;

  /** The value of the input field. */
  value?: string;
} & Pick<
  LegacyTextFieldProps,
  'onChange' | 'isValid' | 'label' | 'disabled' | 'required'
>;

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      onChange,
      onSelect,
      placeholder,
      value = '',
      filter = defaultFilter,
      ...rest
    },
    ref,
  ) => {
    const [state, dispatch] = useReducer(comboboxReducer, {
      isOpen: false,
      activeIndex: null,
      inputValue: value,
    });

    useEffect(() => {
      dispatch({
        type: ComboboxActionType.ChangeInputValue,
        inputValue: value,
      });
    }, [value]);

    const floating = useFloating<HTMLInputElement>({
      whileElementsMounted: autoUpdate,
      open: state.isOpen,
      onOpenChange: (open) =>
        dispatch({ type: ComboboxActionType.OpenOrClose, open }),
      middleware: [
        flip({ padding: 10 }),
        size({
          apply({ rects, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `${availableHeight}px`,
            });
          },
          padding: 10,
        }),
      ],
    });

    const { refs, context } = floating;

    const listRef = useRef<Array<HTMLLIElement | null>>([]);
    const inputRef = useMergeRefs([refs.setReference, ref]);

    const role = useRole(context, { role: 'listbox' });
    const dismiss = useDismiss(context);
    const listNav = useListNavigation(context, {
      listRef,
      activeIndex: state.activeIndex,
      onNavigate: (activeIndex) =>
        dispatch({ type: ComboboxActionType.SetActiveIndex, activeIndex }),
      virtual: true,
      loop: true,
    });

    const interactions = useInteractions([role, dismiss, listNav]);
    const { getReferenceProps } = interactions;

    const filteredOptions = useMemo(
      () => filter(state.inputValue, options),
      [filter, state.inputValue, options],
    );

    const handleSelect = (value: string) => {
      onSelect?.(value);
      dispatch({ type: ComboboxActionType.Select, value });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      dispatch({
        type: ComboboxActionType.ChangeInputValue,
        inputValue: event.target?.value,
      });
    };

    return (
      <>
        <LegacyTextField
          autoComplete='off'
          type='text'
          {...getReferenceProps({
            ref: inputRef,
            onChange: handleChange,
            value: state.inputValue,
            placeholder,
            'aria-autocomplete': 'list',
            onKeyDown(event) {
              if (
                event.key === 'Enter' &&
                state.activeIndex != null &&
                filteredOptions[state.activeIndex]
              ) {
                handleSelect(filteredOptions[state.activeIndex].value);
              }
            },
            ...rest,
          })}
        />
        <ComboboxList
          activeIndex={state.activeIndex}
          floating={floating}
          interactions={interactions}
          listRef={listRef}
          open={state.isOpen}
          options={filteredOptions}
          onSelect={handleSelect}
        />
      </>
    );
  },
);
