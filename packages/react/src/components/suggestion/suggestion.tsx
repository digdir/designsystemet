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

export type SuggestionValues = Array<string | Partial<Item>> | string;

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
  isEmpty?: boolean;
  listId?: string;
  setListId: (id: string) => void;
  handleFilter: (input?: HTMLInputElement | null) => void;
};

export const SuggestionContext = createContext<SuggestionContextType>({
  setListId: () => undefined,
  handleFilter: () => undefined,
});

export type SuggestionProps = {
  /**
   * Filter options, either true, false or a custom callback () => boolean
   *
   * If true, the <datalist> will handle filtering.
   * If false, the <datalist> will not handle filtering.
   * If a custom callback, the callback will be used to filter the <option> elements.
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
   * Allows the user to select multiple items
   *
   * @default false
   */
  multiple?: boolean;
  /**
   * The selected items of the multi-select.
   * Using this makes the component controlled and it must be used in combination with onValueChange
   */
  value?: SuggestionValues;
  /**
   * Default selected items when uncontrolled
   */
  defaultValue?: SuggestionValues;
  /**
   * Callback when selected items changes
   */
  onValueChange?: (value: Item[]) => void; // TODO: get labels as well
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
   * Allows the user to select multiple items
   *
   * @default false
   */
  renderSelected?: (args: { label: string; value: string }) => ReactNode;
} & HTMLAttributes<UHTMLComboboxElement>;

const text = (el: Element): string => el.textContent?.trim() || '';
const sanitizeItems = (values: SuggestionValues = []): Item[] =>
  (typeof values === 'string'
    ? [{ label: values, value: values }]
    : values.map((value) =>
        typeof value === 'string'
          ? { label: value, value }
          : {
              label: value.label || value.value || '',
              value: value.value || '',
            },
      )
  ).filter((x) => !!x.label);

const nextItems = (
  data: HTMLDataElement,
  prev?: SuggestionValues,
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

export const Suggestion = forwardRef<UHTMLComboboxElement, SuggestionProps>(
  function Suggestion(
    {
      children,
      className,
      creatable = false,
      defaultValue,
      filter = true,
      multiple = false,
      name,
      onBeforeMatch,
      onValueChange,
      renderSelected = ({ label }) => label,
      value,
      ...rest
    },
    ref,
  ) {
    const uComboboxRef = useRef<UHTMLComboboxElement>(null);
    const genId = useId();
    const selectId = rest.id ? `${rest.id}-select` : genId;
    const isControlled = value !== undefined;
    const mergedRefs = useMergeRefs([ref, uComboboxRef]);
    const [listId, setListId] = useState(`${rest.id || genId}-list`);
    const [isEmpty, setIsEmpty] = useState(false);
    const [defaultItems, setDefaultItems] = useState<Item[]>(
      sanitizeItems(defaultValue),
    );
    const selectedItems = value ? sanitizeItems(value) : defaultItems;

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
          onValueChange?.(nextItems(data, selectedItems, multiple));
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
        value={{ isEmpty, listId, setListId, handleFilter }}
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
