import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import '@u-elements/u-combobox';
import type { UHTMLComboboxElement } from '@u-elements/u-combobox';
import cl from 'clsx/lite';
import { useMergeRefs } from '../../utilities/hooks';
import { Chip } from '../chip';

export type SuggestionItem = { label: string; value: string };

type EventBeforeMatch = Omit<
  CustomEvent<HTMLOptionElement | undefined>,
  'currentTarget'
> & {
  currentTarget: UHTMLComboboxElement;
};

type Filter = (args: {
  /**
   * Index of the `option`
   */
  index: number;
  /**
   * Label content of the `option`
   */
  label: string;
  /**
   * Text content of the `option`
   */
  text: string;
  /**
   * Value of the `option`
   */
  value: string;
  /**
   * The DOM element of the `option`
   */
  optionElement: HTMLOptionElement;
  /**
   * The DOM element of the `input`
   */
  input: HTMLInputElement;
}) => boolean;

type SuggestionContextType = {
  handleFilter: (input?: HTMLInputElement | null) => void;
  isEmpty?: boolean;
  uComboboxRef?: React.RefObject<UHTMLComboboxElement | null>;
};

type SuggestionValue<T extends { multiple: boolean }> =
  T['multiple'] extends true
    ? Array<string | SuggestionItem>
    : string | SuggestionItem;

type SuggestionBaseProps = {
  /**
   * Filter options; boolean or a custom callback.
   *
   * See {@link Filter} for the callback signature.
   *
   * @default true
   */
  filter?: boolean | Filter;
  /**
   * Allows the user to create new items
   *
   * @default false
   */
  creatable?: boolean;
  /**
   * Callback when matching input value against options
   */
  onBeforeMatch?: (event: EventBeforeMatch) => void;
  /**
   * The name of the associated form control
   *
   * @default undefined
   */
  name?: string;
  /**
   * Change how the selected options are rendered inside the `Chip`.
   *
   * @default ({ label }) => label
   */
  renderSelected?: (args: { label: string; value: string }) => ReactNode;
} & Omit<HTMLAttributes<UHTMLComboboxElement>, 'defaultValue'>;

type SuggestionValueProps<T extends { multiple: boolean }> = {
  /**
   * Allows the user to select multiple items
   *
   * @default false
   */
  multiple?: T['multiple'];
  /**
   * The selected item of the Suggestion.
   *
   * If `label` and `value` are the same, each item can be a `string`. Otherwise, each item must be a `SuggestionItem`.
   *
   * Using this makes the component controlled and it must be used in combination with `onSelectedChange`.
   */
  selected?: SuggestionValue<T> | null;
  /**
   * Default selected item when uncontrolled
   */
  defaultSelected?: SuggestionValue<T>;
  /**
   * Callback when selected items changes
   */
  onSelectedChange?: (
    value: T['multiple'] extends true
      ? SuggestionItem[]
      : SuggestionItem | null,
  ) => void;
};

export type SuggestionSingleProps = SuggestionBaseProps &
  SuggestionValueProps<{ multiple: false }>;

export type SuggestionMultipleProps = SuggestionBaseProps &
  SuggestionValueProps<{ multiple: true }> & { multiple: true }; // ensures multiple: true is never inferred from other props

export type SuggestionProps = SuggestionSingleProps | SuggestionMultipleProps;

type SuggestionSelected =
  | string
  | SuggestionItem
  | Array<string | SuggestionItem>;

const text = (el: Element): string => el.textContent?.trim() || '';
const sanitizeItems = (values: SuggestionSelected = []): SuggestionItem[] =>
  typeof values === 'string'
    ? [{ label: values, value: values }]
    : !Array.isArray(values)
      ? [values]
      : values.map((value) =>
          typeof value === 'string' ? { label: value, value } : value,
        );

const nextItems = (
  data: HTMLDataElement,
  prev?: SuggestionSelected,
  multiple?: boolean,
) => {
  const item: SuggestionItem = { label: text(data), value: data.value };

  if (!multiple) return data.isConnected ? undefined : item;
  return data.isConnected
    ? sanitizeItems(prev).filter(({ value }) => value !== item.value)
    : [...sanitizeItems(prev), item];
};

const defaultFilter: Filter = ({ label, input }) =>
  label.toLowerCase().includes(input.value.trim().toLowerCase());

export const Suggestion = forwardRef<UHTMLComboboxElement, SuggestionProps>(
  function Suggestion(
    {
      children,
      className,
      creatable = false,
      defaultSelected,
      filter = true,
      multiple = false,
      name,
      onBeforeMatch,
      onSelectedChange,
      renderSelected = ({ label }) => label,
      selected,
      ...rest
    },
    ref,
  ) {
    const uComboboxRef = useRef<UHTMLComboboxElement>(null);
    const genId = useId();
    const selectId = rest.id ? `${rest.id}-select` : genId;
    const isControlled = selected !== undefined;
    const mergedRefs = useMergeRefs([ref, uComboboxRef]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [defaultItems, setDefaultItems] = useState<SuggestionItem[]>(
      sanitizeItems(defaultSelected),
    );
    const selectedItems = selected ? sanitizeItems(selected) : defaultItems;
    const onSelectedChangeRef = useRef(onSelectedChange);
    const selectedItemsRef = useRef(selectedItems);

    // Keep the ref updated with the latest callback
    useEffect(() => {
      onSelectedChangeRef.current = onSelectedChange;
    }, [onSelectedChange]);

    useEffect(() => {
      selectedItemsRef.current = selectedItems;
    }, [selectedItems]);

    /**
     * Listerners and handling of adding/removing
     */
    useEffect(() => {
      const combobox = uComboboxRef.current;
      const beforeChange = (event: CustomEvent<HTMLDataElement>) => {
        event.preventDefault();
        const multiple = combobox?.multiple;
        const data = event.detail;
        const nextItem = nextItems(data, selectedItemsRef.current, multiple);

        onSelectedChangeRef.current?.(
          (nextItem as SuggestionItem & SuggestionItem[]) || null,
        );

        if (!isControlled) setDefaultItems(sanitizeItems(nextItem));
      };

      combobox?.addEventListener('comboboxbeforeselect', beforeChange);
      return () =>
        combobox?.removeEventListener('comboboxbeforeselect', beforeChange);
    }, [isControlled]);

    // Before match event listener
    useEffect(() => {
      const combobox = uComboboxRef.current;
      const beforeMatch = (e: Event) => onBeforeMatch?.(e as EventBeforeMatch);

      combobox?.addEventListener('comboboxbeforematch', beforeMatch);
      return () =>
        combobox?.removeEventListener('comboboxbeforematch', beforeMatch);
    }, [onBeforeMatch]);

    const handleFilter = useCallback(() => {
      const { control: input, options = [] } = uComboboxRef?.current || {};
      const filterFn = filter === true ? defaultFilter : filter;
      let disabled = 0;
      let index = 0;

      for (const option of options)
        if (!option.hasAttribute('data-empty')) {
          if (filterFn && input)
            option.disabled =
              !filterFn({
                index,
                input,
                label: option.label,
                optionElement: option,
                text: option.text,
                value: option.value,
              }) && Boolean(++disabled);
          index++; // Increment index for each <option>
        }

      setIsEmpty(index === disabled);
    }, [filter]);

    return (
      <SuggestionContext.Provider
        value={{ isEmpty, handleFilter, uComboboxRef }}
      >
        <u-combobox
          data-multiple={multiple || undefined}
          data-creatable={creatable || undefined}
          class={cl('ds-suggestion', className)} // Using "class" since React does not translate className on custom elements
          ref={mergedRefs}
          {...rest}
        >
          {selectedItems.map((item) => (
            <Chip.Removable key={item.value} value={item.value} asChild>
              <data>{renderSelected(item)}</data>
            </Chip.Removable>
          ))}
          {children}
          {/* Hidden select so it will be sent with a form */}
          {!!name && (
            <select name={name} multiple hidden id={selectId}></select>
          )}
        </u-combobox>
      </SuggestionContext.Provider>
    );
  },
);

export const SuggestionContext = createContext<SuggestionContextType>({
  handleFilter: () => undefined,
});
