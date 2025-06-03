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

type Item = { label: string; value: string };
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

type SuggestionContextType = {
  isEmpty?: boolean;
  selectedItems?: Item[];
  handleFilter: (input?: HTMLInputElement | null) => void;
};

export const SuggestionContext = createContext<SuggestionContextType>({
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
      ? { label: value, value }
      : {
          label: value.label || value.value || '',
          value: value.value || '',
        },
  );

const nextItems = (
  data: HTMLDataElement,
  prev?: Value[],
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
        const multiple = combobox?.multiple;
        const data = event.detail;

        if (isContolled)
          onValueChange?.(nextItems(data, prevControlled.current, multiple));
        else
          setSelectedItems((prevItems) => nextItems(data, prevItems, multiple));
      };

      combobox?.addEventListener('beforechange', beforeChange);
      return () => combobox?.removeEventListener('beforechange', beforeChange);
    }, [isContolled, setSelectedItems]);

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
        value={{ isEmpty, selectedItems, handleFilter }}
      >
        <u-combobox
          data-multiple={multiple || undefined}
          data-creatable={creatable || undefined}
          class={cl('ds-suggestion', className)} // Using "class" since React does not translate className on custom elements
          ref={mergedRefs}
          {...rest}
        >
          {children}
          {/* Hidden select so it will be sent with a form */}
          {!!name && <select name={name} multiple hidden></select>}
        </u-combobox>
      </SuggestionContext.Provider>
    );
  },
);
