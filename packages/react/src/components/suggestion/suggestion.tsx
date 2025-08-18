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

type Item = { label: string; value: string };
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

export const SuggestionContext = createContext<SuggestionContextType>({
  handleFilter: () => undefined,
});

type SuggestionValue<T extends { multiple: boolean }> =
  T['multiple'] extends true ? Array<string | Partial<Item>> : string;

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
   * Callback when selected items changes
   */
  onSelectedChange?: (value: Item[]) => void;
  /**
   * @deprecated Use `onSelectedChange` instead
   */
  onValueChange?: (value: Item[]) => void; // Kept for backwards compatibility
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
} & HTMLAttributes<UHTMLComboboxElement>;

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
   * Using this makes the component controlled and it must be used in combination with `onSelectedChange`.
   */
  selected?: SuggestionValue<T>;
  /**
   * @deprecated Use `selected` instead
   */
  value?: SuggestionValue<T>; // Kept for backwards compatibility
  /**
   * Default selected item when uncontrolled
   */
  defaultSelected?: SuggestionValue<T>;
  /**
   * @deprecated Use `defaultSelected` instead
   */
  defaultValue?: SuggestionValue<T>; // Kept for backwards compatibility
};

export type SuggestionSingleProps = SuggestionBaseProps &
  SuggestionValueProps<{ multiple: false }>;

export type SuggestionMultipleProps = SuggestionBaseProps &
  SuggestionValueProps<{ multiple: true }>;

export type SuggestionProps = SuggestionSingleProps | SuggestionMultipleProps;

export type SuggestionSelected = string | Array<string | Partial<Item>>; // Kept for backwards compatibility

const text = (el: Element): string => el.textContent?.trim() || '';
const sanitizeItems = (
  values: Array<string | Partial<Item>> | string = [],
): Item[] =>
  (typeof values === 'string'
    ? [{ label: values, value: values }]
    : values.map((value: string | Partial<Item>) =>
        typeof value === 'string'
          ? { label: value, value }
          : {
              label: value.label || value.value || '',
              value: value.value || '',
            },
      )
  ).filter((x: Item) => !!x.label);

const nextItems = (
  data: HTMLDataElement,
  prev?: Array<string | Partial<Item>> | string,
  multiple?: boolean,
) => {
  const item = { label: text(data), value: data.value };

  if (!multiple) return data.isConnected ? [] : [item];
  return data.isConnected
    ? sanitizeItems(prev).filter(({ value }) => value !== item.value)
    : [...sanitizeItems(prev), item];
};

const defaultFilter: Filter = ({ label, input }) =>
  label.toLowerCase().includes(input.value.trim().toLowerCase());

const deprecate = (from: string, to: string) =>
  console.warn(
    `Suggestion: Using "${from}" is deprecated, please use "${to}" instead.`,
  );

export const Suggestion = forwardRef<UHTMLComboboxElement, SuggestionProps>(
  function Suggestion(
    {
      children,
      className,
      creatable = false,
      defaultSelected: _defaultSelected,
      defaultValue,
      filter = true,
      multiple = false,
      name,
      onBeforeMatch,
      onSelectedChange: _onSelectedChange,
      onValueChange,
      renderSelected = ({ label }) => label,
      selected: _selected,
      value,
      ...rest
    },
    ref,
  ) {
    // For backwards compatibility:
    const selected = _selected ?? value;
    const defaultSelected = _defaultSelected ?? defaultValue;
    const onSelectedChange = _onSelectedChange ?? onValueChange;
    if (value) deprecate('value', 'selected');
    if (defaultValue) deprecate('defaultValue', 'defaultSelected');
    if (onValueChange) deprecate('onValueChange', 'onSelectedChange');

    const uComboboxRef = useRef<UHTMLComboboxElement>(null);
    const genId = useId();
    const selectId = rest.id ? `${rest.id}-select` : genId;
    const isControlled = selected !== undefined;
    const mergedRefs = useMergeRefs([ref, uComboboxRef]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [defaultItems, setDefaultItems] = useState<Item[]>(
      sanitizeItems(defaultSelected),
    );
    const selectedItems = selected ? sanitizeItems(selected) : defaultItems;

    /**
     * Listerners and handling of adding/removing
     */
    useEffect(() => {
      const combobox = uComboboxRef.current;
      const beforeChange = (event: CustomEvent<HTMLDataElement>) => {
        event.preventDefault();
        const multiple = combobox?.multiple;
        const data = event.detail;

        if (isControlled)
          onSelectedChange?.(nextItems(data, selectedItems, multiple));
        else setDefaultItems(nextItems(data, selectedItems, multiple));
      };

      combobox?.addEventListener('beforechange', beforeChange);
      return () => combobox?.removeEventListener('beforechange', beforeChange);
    }, [selectedItems, isControlled]);

    // Before match event listener
    useEffect(() => {
      const combobox = uComboboxRef.current;
      const beforeMatch = (e: Event) => onBeforeMatch?.(e as EventBeforeMatch);

      combobox?.addEventListener('beforematch', beforeMatch);
      return () => combobox?.removeEventListener('beforematch', beforeMatch);
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
