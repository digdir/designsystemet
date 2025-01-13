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
// import { setReactInputValue } from './SuggestionClear';

type SuggestionContextType = {
  listId?: string;
  setListId?: (id: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

export const SuggestionContext = createContext<SuggestionContextType>({});

export type SuggestionProps = DefaultProps &
  React.HTMLAttributes<HTMLDivElement>;

export const Suggestion = forwardRef<HTMLDivElement, SuggestionProps>(
  function Suggestion({ defaultValue, className, ...rest }, ref) {
    const [listId, setListId] = useState(useId());
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <SuggestionContext.Provider value={{ inputRef, listId, setListId }}>
        <div className={cl('ds-suggestion', className)} ref={ref} {...rest} />
      </SuggestionContext.Provider>
    );
  },
);
