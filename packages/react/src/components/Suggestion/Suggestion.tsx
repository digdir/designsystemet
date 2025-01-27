import { getDatalistValue, syncDatalistState } from '@u-elements/u-datalist';
import cl from 'clsx/lite';
import {
  createContext,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import type { DefaultProps } from '../../types';

type SuggestionContextType = {
  singular?: string;
  plural?: string;
  listId?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  setListId?: (id: string) => void;
  handleFilter?: (input?: HTMLInputElement | null) => void;
};

export const SuggestionContext = createContext<SuggestionContextType>({});

export type SuggestionProps = DefaultProps &
  React.HTMLAttributes<HTMLDivElement> & {
    /**
     * The screen reader announcement for singular suggestion, where %d is the number of suggestions
     * @default '%d forslag'
     */
    singular?: string;
    /**
     * The screen reader announcement for plural suggestions, where %d is the number of suggestions
     * @default '%d forslag'
     */
    plural?: string;
    /**
     * Filter options, either true | false or custom callback () => boolean
     * @default true
     */
    filter?:
      | boolean
      | ((args: {
          index: number;
          text: string;
          value: string;
          optionElement: HTMLOptionElement;
          input: HTMLInputElement;
        }) => boolean);
  };

export const Suggestion = forwardRef<HTMLDivElement, SuggestionProps>(
  function Suggestion(
    {
      className,
      singular = '%d forslag',
      plural = '%d forslag',
      filter = true,
      ...rest
    },
    ref,
  ) {
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
      <SuggestionContext.Provider
        value={{ singular, plural, inputRef, listId, setListId, handleFilter }}
      >
        <div className={cl('ds-suggestion', className)} ref={ref} {...rest} />
      </SuggestionContext.Provider>
    );
  },
);
