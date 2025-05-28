import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import '@u-elements/u-combobox';
import type { UHTMLComboboxElement } from '@u-elements/u-combobox';
import cl from 'clsx/lite';
import { useMergeRefs } from '../../utilities/hooks';

type Item = { text: string; value: string };
type Value = string | Partial<Item>;
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

type MultiSuggestionContextType = {
  isEmpty?: boolean;
  selectedItems?: Item[];
  handleFilter: (input?: HTMLInputElement | null) => void;
};

export const MultiSuggestionContext = createContext<MultiSuggestionContextType>(
  {
    handleFilter: () => undefined,
  },
);

export type MultiSuggestionProps = {
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
   * The selected items of the multi-select.
   * Using this makes the component controlled and it must be used in combination with onValueChange
   */
  value?: Value[];
  /**
   * Default selected items when uncontrolled
   */
  defaultValue?: Value[];
  /**
   * Callback when selected items changes
   */
  onValueChange?: (value: Item[]) => void; // TODO: get labels as well
  /**
   * The name of the associated form control
   *
   * @default undefined
   */
  name?: string;
} & HTMLAttributes<UHTMLComboboxElement>;

const text = (el: Element): string => el.textContent?.trim() || '';
const sanitizeItems = (values: Value[] = []): Item[] =>
  values.map((value) =>
    typeof value === 'string'
      ? { text: value, value }
      : {
          text: value.text || value.value || '',
          value: value.value || '',
        },
  );

const toggleItem = (item: HTMLDataElement, prevItems?: Value[]) =>
  item.isConnected
    ? sanitizeItems(prevItems).filter(({ value }) => value !== item.value)
    : [...sanitizeItems(prevItems), { text: text(item), value: item.value }];

const defaultFilter: Filter = ({ label, input }) =>
  label.toLowerCase().includes(input.value.trim().toLowerCase());

export const MultiSuggestion = forwardRef<
  UHTMLComboboxElement,
  MultiSuggestionProps
>(function MultiSuggestion(
  {
    creatable = false,
    children,
    className,
    defaultValue,
    filter = true,
    name,
    onValueChange,
    value,
    ...rest
  },
  ref,
) {
  const uComboboxRef = useRef<UHTMLComboboxElement>(null);
  const isContolled = value !== undefined;
  const mergedRefs = useMergeRefs([ref, uComboboxRef]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>(
    sanitizeItems(defaultValue || value),
  );

  // Update if controlled values
  const prevControlled = useRef(value);
  if (value !== prevControlled.current) {
    prevControlled.current = value;
    setSelectedItems(sanitizeItems(prevControlled.current));
  }

  /**
   * Listerners and handling of adding/removing
   */
  useEffect(() => {
    const combobox = uComboboxRef.current;
    const beforeChange = (event: CustomEvent<HTMLDataElement>) => {
      event.preventDefault();
      if (isContolled)
        onValueChange?.(toggleItem(event.detail, prevControlled.current));
      else setSelectedItems((prevItems) => toggleItem(event.detail, prevItems));
    };

    combobox?.addEventListener('beforechange', beforeChange);
    return () => combobox?.removeEventListener('beforechange', beforeChange);
  }, [isContolled, setSelectedItems]);

  const handleFilter = useCallback(() => {
    const { control: input, options = [] } = uComboboxRef?.current || {};
    const enabled = filter === true ? defaultFilter : filter;
    let disabled = 0;
    let index = 0;

    for (const option of options)
      if (!option.hasAttribute('data-empty')) {
        index++; // Increment index for each <option>

        if (enabled && input)
          option.disabled =
            !enabled({
              index,
              input,
              label: option.label,
              optionElement: option,
              text: option.text,
              value: option.value,
            }) && Boolean(++disabled);
      }

    setIsEmpty(index === disabled);
  }, [filter]);

  return (
    <MultiSuggestionContext.Provider
      value={{ isEmpty, selectedItems, handleFilter }}
    >
      <u-combobox
        data-multiple
        data-creatable={creatable || undefined}
        class={cl('ds-multi-suggestion', className)} // Using "class" since React does not translate className on custom elements
        ref={mergedRefs}
        {...rest}
      >
        {children}
        {/* Hidden select so it will be sent with a form */}
        {!!name && <select name={name} multiple hidden></select>}
      </u-combobox>
    </MultiSuggestionContext.Provider>
  );
});
