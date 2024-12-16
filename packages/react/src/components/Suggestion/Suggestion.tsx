import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import {
  createContext,
  forwardRef,
  // useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
// import { setReactInputValue } from './SuggestionClear';

type SuggestionContextType = {
  listId?: string;
  setListId?: (id: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  // listRef?: React.RefObject<HTMLDataListElement>;
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
    const innerRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRefs = useMergeRefs([innerRef, ref]);
    // const listRef = useRef<HTMLDataListElement>(null);

    // const [internalValue, setInternalValue] = useState<string>(
    //   defaultValue || '',
    // );

    /* function for sending value changes to consumer */
    // const handleValueChange = (value: string) => {
    //   if (value !== internalValue) {
    //     setInternalValue(value);
    //     onChange?.(value);
    //   }
    // };

    // /* Handle default value */
    // useEffect(() => {
    //   if (defaultValue) {
    //     if (!inputRef.current || !listRef.current) return;
    //     inputRef.current && setReactInputValue(inputRef.current, defaultValue);
    //     for (const option of listRef.current.options) {
    //       if (option.value === defaultValue) {
    //         option.selected = true;
    //       }
    //     }
    //   }
    // }, [defaultValue]);

    /* Handle onChange */
    // useEffect(() => {
    //   /* If we want input text to be value */
    //   /* const div = innerRef.current as HTMLDivElement | null; */
    //   /* const handleChange = () =>
    //   handleValueChange(inputRef.current?.value || ''); */
    //   const options = listRef.current?.options;

    //   const handleChange = (e: Event) => {
    //     const inputEvent = e as InputEvent;
    //     if (!inputEvent.inputType) {
    //       handleValueChange((e.target as HTMLInputElement)?.value || '');
    //     }

    //     /* Check if input matches a value */
    //     if (options) {
    //       const input = inputEvent.target as HTMLInputElement;
    //       console.log(options);
    //       console.log(input.value);
    //       for (const option of options) {
    //         console.log(option.value);
    //         if (option.value === input.value) {
    //           console.log('I found a match');
    //           /* Select option */
    //           option.selected = true;
    //           break;
    //         }
    //       }
    //     }
    //   };

    //   inputRef.current?.addEventListener('input', handleChange);
    //   return () => inputRef.current?.removeEventListener('input', handleChange);

    //   /* If we want input text to be value */
    //   /* div?.addEventListener('input', handleChange);
    //   return () => div?.removeEventListener('input', handleChange); */
    // }, [internalValue, listRef, inputRef, handleValueChange]);

    /* update internalValue and input value when value changes */
    // useEffect(() => {
    //   /* If value is not set, it is not controlled */
    //   if (typeof value !== 'string') return;

    //   if (!onChange) {
    //     console.error("You're setting a value without an onChange handler");
    //   }

    //   if (value !== internalValue) setInternalValue(value || '');

    //   /* Update input and u-elements value */
    //   inputRef.current && setReactInputValue(inputRef.current, value || '');
    //   const options = listRef.current?.options;
    //   if (options) {
    //     for (const option of options) {
    //       if (option.value === value) {
    //         option.selected = true;
    //       } else {
    //         option.selected = false;
    //       }
    //     }
    //   }
    // }, [value, internalValue]);

    return (
      <SuggestionContext.Provider
        value={{ listId, setListId, inputRef }} //, listRef
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
