import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import { createContext, forwardRef, useId, useRef, useState } from 'react';
import type { DefaultProps } from '../../types';

type SuggestionContextType = {
  listId?: string;
  setListId?: (id: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

export const SuggestionContext = createContext<SuggestionContextType>({});

export type SuggestionProps =
  DefaultProps & {} & React.HTMLAttributes<HTMLDivElement>;

export const Suggestion = forwardRef<HTMLDivElement, SuggestionProps>(
  function Suggestion({ className, ...rest }, ref) {
    const [listId, setListId] = useState(useId());

    const innerRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRefs = useMergeRefs([innerRef, ref]);

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
