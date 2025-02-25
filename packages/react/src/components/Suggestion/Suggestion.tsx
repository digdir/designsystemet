import { Slot } from '@radix-ui/react-slot';
import { getDatalistValue, syncDatalistState } from '@u-elements/u-datalist';
import cl from 'clsx/lite';
import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

type SuggestionContextType = {
  listId?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  setListId?: (id: string) => void;
  handleFilter?: (input?: HTMLInputElement | null) => void;
};

export const SuggestionContext = createContext<SuggestionContextType>({});

export type SuggestionProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
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
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
  }
>;

/**
 * A component that provides a suggestion list for an input field.
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.Clear />
 *   <Suggestion.List>
 *     <Suggestion.Empty>Tomt</Suggestion.Empty>
 *     <Suggestion.Option value='Option 1'>Option 1</Suggestion.Option>
 *     <Suggestion.Option value='Option 2'>Option 2</Suggestion.Option>
 *   </Suggestion.List>
 * </Suggestion>
 */
export const Suggestion = forwardRef<HTMLDivElement, SuggestionProps>(
  function Suggestion({ className, filter = true, asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'div';

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
      <SuggestionContext.Provider
        value={{ inputRef, listId, setListId, handleFilter }}
      >
        <Component
          className={cl('ds-suggestion', className)}
          ref={ref}
          {...rest}
        />
      </SuggestionContext.Provider>
    );
  },
);
