import {
  type HTMLAttributes,
  type RefObject,
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import '@u-elements/u-tags';
import { getDatalistValue, syncDatalistState } from '@u-elements/u-datalist';
import type { UHTMLTagsElement } from '@u-elements/u-tags';
import cl from 'clsx/lite';
import { useMergeRefs } from '../../utilities/hooks';

type MultiSuggestionContextType = {
  selectedItems?: { [key: string]: HTMLDataElement };
  listId?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  setListId?: (id: string) => void;
  handleFilter?: (input?: HTMLInputElement | null) => void;
};

export const MultiSuggestionContext = createContext<MultiSuggestionContextType>(
  {},
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
  filter?:
    | boolean
    | ((args: {
        /**
         * Index of the `option`
         */
        index: number;
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
      }) => boolean);
  /**
   * Allows the user to create new items
   *
   * @default false
   */
  allowCreate?: boolean;
  /**
   * The selected items of the multi-select.
   * Using this makes the component controlled and it must be used in combination with onValueChange
   */
  value?: string[];
  /**
   * Default selected items when uncontrolled
   */
  defaultValue?: string[];
  /**
   * Callback when selected items changes
   */
  onValueChange?: (value: string[]) => void;
  /**
   * The name of the associated form control
   *
   * @default undefined
   */
  name?: string;
} & HTMLAttributes<UHTMLTagsElement>;

export const MultiSuggestion = forwardRef<
  UHTMLTagsElement,
  MultiSuggestionProps
>(function MultiSuggestion(
  {
    value,
    defaultValue,
    onValueChange,
    name,
    filter = true,
    allowCreate = false,
    className,
    ...rest
  },
  ref,
) {
  const [listId, setListId] = useState(useId());
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: HTMLDataElement;
  }>({});

  const inputRef = useRef<HTMLInputElement | null>(null);
  const uTagsRef = useRef<UHTMLTagsElement>(null);
  const mergedRefs = useMergeRefs([ref, uTagsRef]);
  const isControlled = Boolean(value);
  const [controlledDirty, setControlledDirty] = useState(false);

  /**
   * If we have set a default value, set it on initial render
   */
  useEffect(() => {
    if (!defaultValue) return;
    if (value) {
      console.warn('defaultValue can not be used in combination with value');
      return;
    }
    const items = uTagsRef.current?.querySelectorAll('u-option');
    if (!items) return;

    const defaultItems = Array.from(items).filter((item) =>
      defaultValue.includes(item.value),
    );

    for (const item of defaultItems) {
      uTagsRef.current?.dispatchEvent(
        new CustomEvent('add', {
          detail: { item },
        }),
      );
      setSelectedItems((prevItems) => ({
        ...prevItems,
        [item.value]: item,
      }));
    }

    return () => {
      console.error('Default value changed during render');
    };
  }, [defaultValue]);

  /**
   * Controlled state management
   */
  useEffect(() => {
    if (!value) return;
    const items = inputRef.current?.list?.options;
    if (!items) return;
    const itemsArray = Array.from(items);
    const itemsArrayValues = itemsArray.map((item) => item.value);

    const selectedArray = Object.keys(selectedItems);
    const validValues = value.filter((val) => itemsArrayValues.includes(val));
    const itemsToAdd = validValues.filter(
      (val) => !selectedArray.includes(val),
    );
    const itemsToRemove = selectedArray.filter(
      (val) => !validValues.includes(val),
    );

    for (const item of itemsArray) {
      if (itemsToAdd.includes(item.value)) {
        uTagsRef.current?.dispatchEvent(
          new CustomEvent('add', {
            detail: { item },
          }),
        );
        setSelectedItems((prevItems) => ({
          ...prevItems,
          [item.value]: item,
        }));
      }
      if (itemsToRemove.includes(item.value)) {
        uTagsRef.current?.dispatchEvent(
          new CustomEvent('remove', {
            detail: { item },
          }),
        );
        setSelectedItems((prevItems) => {
          const { [item.value]: _, ...rest } = prevItems;
          return rest;
        });
      }
    }
  }, [value]);

  /**
   * Listerners and handling of adding/removing
   */
  useEffect(() => {
    if (!uTagsRef?.current) return;

    const handleItemsChange = (
      e: CustomEvent<{
        action: 'add' | 'remove';
        item: HTMLDataElement;
      }>,
    ) => {
      e.preventDefault();
      const item = e.detail.item;

      if (e.detail.action === 'add') {
        /**
         * If creating is off, check if the value is allowed to be added
         */
        if (!allowCreate) {
          const optionExists = Array.from(
            inputRef.current?.list?.options || [],
            getDatalistValue,
          ).includes(item.value);

          if (!optionExists) return;
        }

        setSelectedItems((prevItems) => ({
          ...prevItems,
          [item.value]: item,
        }));
      }

      if (e.detail.action === 'remove') {
        setSelectedItems((prevItems) => {
          const { [item.value]: _, ...rest } = prevItems;
          return rest;
        });
      }
      if (isControlled) setControlledDirty(true);
    };

    uTagsRef.current.addEventListener('tags', handleItemsChange);
    return () => {
      uTagsRef.current?.removeEventListener('tags', handleItemsChange);
    };
  }, [uTagsRef, setSelectedItems]);

  /**
   * When controlled, trigger onValueChange callback for ordinary add/remove
   */
  useEffect(() => {
    if (!controlledDirty) return;
    onValueChange?.(Object.keys(selectedItems));
    setControlledDirty(false);
  }, [controlledDirty]);

  const handleFilter = useCallback(
    (input?: HTMLInputElement | null) => {
      const list = input?.list;

      // Let <datalist> handle filtering if filter is true
      if (filter === true || !list) return;

      // Handle custom filter
      if (filter !== false) {
        let index = 0;
        for (const option of list.getElementsByTagName('u-option')) {
          if (!option.hasAttribute('data-empty'))
            option.disabled = !filter({
              index: index++, // Increment index for each <option>
              input,
              optionElement: option,
              text: option.text,
              value: getDatalistValue(option),
            });
        }
      }

      syncDatalistState(input); // Sync the datalist state if filter is custom or false
    },
    [filter],
  );

  return (
    <MultiSuggestionContext.Provider
      value={{
        inputRef,
        listId,
        selectedItems,
        setListId,
        handleFilter,
      }}
    >
      <u-tags
        class={cl('ds-multi-suggestion', className)} // Using "class" since React does not translate className on custom elements
        ref={mergedRefs}
        {...rest}
      />
      {/* Hidden select so it will be sent with a form */}
      {name && (
        <select multiple hidden name={name}>
          {Object.values(selectedItems).map((item) => (
            <option key={item.value} value={item.value} />
          ))}
        </select>
      )}
    </MultiSuggestionContext.Provider>
  );
});
