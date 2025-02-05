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
import { useMergeRefs } from '@floating-ui/react';
import { getDatalistValue, syncDatalistState } from '@u-elements/u-datalist';
import type { UHTMLTagsElement } from '@u-elements/u-tags';
import cl from 'clsx/lite';

type MultiSelectContextType = {
  selectedItems?: { [key: string]: HTMLDataElement };
  listId?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  uTagsRef?: RefObject<UHTMLTagsElement | null>;
  setListId?: (id: string) => void;
  handleFilter?: (input?: HTMLInputElement | null) => void;
};

export const MultiSelectContext = createContext<MultiSelectContextType>({});

export type MultiSelectProps = {
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
  onChange?: (value: string[]) => void;
  value?: string[];
  defaultValue?: string[];
  name?: string;
} & HTMLAttributes<UHTMLTagsElement>;

export const MultiSelect = forwardRef<UHTMLTagsElement, MultiSelectProps>(
  function MultiSelect(
    { value, defaultValue, onChange, name, filter = false, className, ...rest },
    ref,
  ) {
    const [listId, setListId] = useState(useId());
    const [selectedItems, setSelectedItems] = useState<{
      [key: string]: HTMLDataElement;
    }>({});

    const inputRef = useRef<HTMLInputElement | null>(null);
    const uTagsRef = useRef<UHTMLTagsElement>(null);
    const mergedRefs = useMergeRefs([ref, uTagsRef]);

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
          setSelectedItems((prevItems) => ({
            ...prevItems,
            [item.value]: item,
          }));
        }

        if (e.detail.action === 'remove') {
          const value = item.getAttribute('data-value');
          setSelectedItems((prevItems) => {
            if (value) {
              const { [value]: _, ...rest } = prevItems;
              return rest;
            }
            return prevItems;
          });
        }
      };

      uTagsRef.current.addEventListener('tags', handleItemsChange);

      return () => {
        uTagsRef.current?.removeEventListener('tags', handleItemsChange);
      };
    }, [uTagsRef, setSelectedItems]);

    /* Send change event with values */
    /* useEffect(() => {
      if (!onChange) return;
      onChange(Object.keys(selectedItems));
    }, [selectedItems, onChange]); */

    const handleFilter = useCallback(
      (input?: HTMLInputElement | null) => {
        const list = input?.list;

        // Let <datalist> handle filtering if filter is true
        if (filter === true || !list) return;

        // Handle custom filter
        if (filter !== false) {
          let index = 0;
          for (const option of list.children as HTMLCollectionOf<HTMLOptionElement>) {
            // Skip <datalist> children that are not <option>
            if ('value' in option)
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
      <MultiSelectContext.Provider
        value={{
          inputRef,
          uTagsRef,
          listId,
          selectedItems,
          setListId,
          handleFilter,
        }}
      >
        <u-tags
          class={cl('ds-multi-select', className)} // Using "class" since React does not translate className on custom elements
          ref={mergedRefs}
          {...rest}
        />
        {/* Hidden select so it will be sent with a form */}
        <select multiple hidden name={name}>
          {Object.values(selectedItems).map((item) => (
            <option key={item.value} value={item.value} />
          ))}
        </select>
      </MultiSelectContext.Provider>
    );
  },
);
