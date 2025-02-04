import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import '@u-elements/u-tags';
import { getDatalistValue, syncDatalistState } from '@u-elements/u-datalist';
import type { UHTMLTagsElement } from '@u-elements/u-tags';
import cl from 'clsx/lite';

type MultiSelectContextType = {
  listId?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
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
} & HTMLAttributes<UHTMLTagsElement>;

export const MultiSelect = forwardRef<UHTMLTagsElement, MultiSelectProps>(
  function MultiSelect({ filter = false, className, ...rest }, ref) {
    const [listId, setListId] = useState(useId());
    const inputRef = useRef<HTMLInputElement | null>(null);

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
        value={{ handleFilter, inputRef, listId, setListId }}
      >
        <u-tags
          class={cl('ds-multi-select', className)} // Using "class" since React does not translate className on custom elements
          ref={ref}
          {...rest}
        />
      </MultiSelectContext.Provider>
    );
  },
);
