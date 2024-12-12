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
    const mergedRefs = useMergeRefs([innerRef, ref]);

    // Handle onChange
    useEffect(() => {
      const div = innerRef.current as HTMLDivElement | null;
      const handleChange = () => onChange?.(inputRef.current?.value || '');

      div?.addEventListener('input', handleChange);
      return () => div?.removeEventListener('input', handleChange);
    }, [internalValue]);

    // call onChange when internalValue changes
    useEffect(() => {
      onChange?.(internalValue);
    }, [internalValue, onChange]);

    // update internalValue and input value when value changes
    useEffect(() => {
      if (value && value !== internalValue) setInternalValue(value || '');
      inputRef.current && setReactInputValue(inputRef.current, value || '');
    }, [value]);

    return (
      <SuggestionContext.Provider value={{ listId, setListId, inputRef }}>
        <div
          className={cl('ds-suggestion', className)}
          ref={mergedRefs}
          {...rest}
        />
      </SuggestionContext.Provider>
    );
  },
);
