import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import {
  createContext,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { setReactInputValue } from './SuggestionClear';

type SuggestionContextType = {
  listId?: string;
  setListId?: (id: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  listRef?: React.RefObject<HTMLDataListElement>;
  handleValueChange?: (value: string) => void;
};

export const SuggestionContext = createContext<SuggestionContextType>({});

export type SuggestionProps = MergeRight<
  DefaultProps & React.HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Callback for when the value changes
     *
     */
    onChange?: (value: string) => void;
    /**
     * The default value
     */
    defaultValue?: string;
    /**
     * The value when controlled
     */
    value?: string;
  }
>;

export const Suggestion = forwardRef<HTMLDivElement, SuggestionProps>(
  function Suggestion(
    { defaultValue, value, onChange, className, ...rest },
    ref,
  ) {
    const [listId, setListId] = useState(useId());
    const [internalValue, setInternalValue] = useState<string>(
      defaultValue || '',
    );

    const innerRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDataListElement>(null);
    const mergedRefs = useMergeRefs([innerRef, ref]);

    /* function for sending value changes to consumer */
    const handleValueChange = (value: string) => {
      if (value !== internalValue) {
        setInternalValue(value);
        onChange?.(value);
      }
    };

    // Handle onChange
    useEffect(() => {
      const div = innerRef.current as HTMLDivElement | null;
      const handleChange = () =>
        handleValueChange(inputRef.current?.value || '');

      div?.addEventListener('input', handleChange);
      return () => div?.removeEventListener('input', handleChange);
    }, [internalValue]);

    // update internalValue and input value when value changes
    useEffect(() => {
      if (value && value !== internalValue) setInternalValue(value || '');

      /* Update input and u-elements value */
      inputRef.current && setReactInputValue(inputRef.current, value || '');
      const options = listRef.current?.querySelectorAll('u-option');
      if (options) {
        for (const option of options) {
          if (option.value === value) {
            option.selected = true;
          } else {
            option.selected = false;
          }
        }
      }
    }, [value, internalValue]);

    return (
      <SuggestionContext.Provider
        value={{ listId, setListId, inputRef, listRef, handleValueChange }}
      >
        <div
          className={cl('ds-suggestion', className)}
          ref={mergedRefs}
          {...rest}
        />
      </SuggestionContext.Provider>
    );
  },
);
