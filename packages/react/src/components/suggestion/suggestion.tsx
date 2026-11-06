import type {
  DSSuggestionElement,
  SuggestionItem,
} from '@digdir/designsystemet-web';
import cl from 'clsx/lite';
import { forwardRef, useEffect, useRef } from 'react';
import { useMergeRefs } from '../../utilities/hooks';

/* @deprecated props */
export type { SuggestionItem } from '@digdir/designsystemet-web';
export type SuggestionSingleProps = SuggestionProps;
export type SuggestionMultipleProps = SuggestionProps;

// type Filter = (args: {
//   /**
//    * Index of the `option`
//    */
//   index: number;
//   /**
//    * Label content of the `option`
//    */
//   label: string;
//   /**
//    * Text content of the `option`
//    */
//   text: string;
//   /**
//    * Value of the `option`
//    */
//   value: string;
//   /**
//    * The DOM element of the `option`
//    */
//   optionElement: HTMLOptionElement;
//   /**
//    * The DOM element of the `input`
//    */
//   input: HTMLInputElement;
// }) => boolean;

export type SuggestionProps = {
  /**
   * Allows the user to create new items
   *
   * @default false
   */
  'data-creatable'?: boolean;
  /**
   * Allows the user to select multiple items
   *
   * @default false
   */
  'data-multiple'?: boolean;
  /**
   * The name of the associated form control
   *
   * @default undefined
   */
  name?: string;
  /**
   * The selected item of the Suggestion.
   *
   * If `label` and `value` are the same, each item can be a `string`. Otherwise, each item must be a `SuggestionItem`.
   *
   * Using this makes the component controlled and it must be used in combination with `onSelectedChange`.
   */
  selected?: SuggestionItem | null;
  /**
   * Change how the selected options are rendered inside the `Chip`.
   *
   * @default ({ label }) => label
   */
  renderSelected?: (args: { label: string; value: string }) => React.ReactNode;

  oncomboboxafterselect?: (event: CustomEvent<HTMLDataElement>) => void;
  oncomboboxbeforeselect?: (event: CustomEvent<HTMLDataElement>) => void;
  oncomboboxbeforematch?: (
    event: CustomEvent<HTMLOptionElement | undefined>,
  ) => void;
} & Omit<React.HTMLAttributes<DSSuggestionElement>, 'defaultValue'>;

// type SuggestionSelected =
//   | string
//   | SuggestionItem
//   | Array<string | SuggestionItem>;

// const text = (el: Element): string => el.textContent?.trim() || '';
// const sanitizeItems = (values: SuggestionSelected = []): SuggestionItem[] =>
//   typeof values === 'string'
//     ? [{ label: values, value: values }]
//     : !Array.isArray(values)
//       ? [values]
//       : values.map((value) =>
//           typeof value === 'string' ? { label: value, value } : value,
//         );

// const _nextItems = (
//   data: HTMLDataElement,
//   prev?: SuggestionSelected,
//   multiple?: boolean,
// ) => {
//   const item: SuggestionItem = { label: text(data), value: data.value };

//   if (!multiple) return data.isConnected ? undefined : item;
//   return data.isConnected
//     ? sanitizeItems(prev).filter(({ value }) => value !== item.value)
//     : [...sanitizeItems(prev), item];
// };

export const Suggestion = forwardRef<DSSuggestionElement, SuggestionProps>(
  function Suggestion(
    {
      children,
      className,
      name,
      oncomboboxafterselect,
      oncomboboxbeforematch,
      oncomboboxbeforeselect,
      ...rest
    },
    ref,
  ) {
    const suggestionRef = useRef<DSSuggestionElement>(null);
    const onAfterSelectRef = useRef(oncomboboxafterselect);
    const onBeforeSelectRef = useRef(oncomboboxbeforeselect);
    const onBeforeMatchRef = useRef(oncomboboxbeforematch);
    const mergedRefs = useMergeRefs([ref, suggestionRef]);

    // Support React 18
    useEffect(() => {
      const self = suggestionRef.current;
      const after = onAfterSelectRef.current;
      const before = onBeforeSelectRef.current;
      const match = onBeforeMatchRef.current;

      if (after) self?.addEventListener('comboboxafterselect', after);
      if (before) self?.addEventListener('comboboxbeforeselect', before);
      if (match) self?.addEventListener('comboboxbeforematch', match);
      return () => {
        if (after) self?.removeEventListener('comboboxafterselect', after);
        if (before) self?.removeEventListener('comboboxbeforeselect', before);
        if (match) self?.removeEventListener('comboboxbeforematch', match);
      };
    }, []);

    return (
      <ds-suggestion
        class={cl('ds-suggestion', className)} // Using "class" since React does not translate className on custom elements
        ref={mergedRefs}
        suppressHydrationWarning // Since <ds-suggestion> adds attributes
        {...rest}
      >
        {/* {selectedItems.map((item) => (
          <data
            key={item.value}
            value={item.value}
            suppressHydrationWarning // Since <ds-suggestion> adds attributes
          >
            {renderSelected(item)}
          </data>
        ))} */}
        {children}
        {/* Hidden select so it will be sent with a form */}
        {!!name && <select name={name} multiple hidden></select>}
      </ds-suggestion>
    );
  },
);
