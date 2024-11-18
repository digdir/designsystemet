import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import '@u-elements/u-tags';
import type { UHTMLTagsElement } from '@u-elements/u-tags';
import type { DefaultProps } from '../../../../types';

/* I think we can always send a string array */
type ComboboxContextType = {
  listId?: string;
  setListId?: (id: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

export const ComboboxContext = createContext<ComboboxContextType>({});

export type ComboboxProps = {
  onChange: (values: string[]) => void;
  /**
   * Multiple options can be selected
   * @default false
   */
  multiple?: boolean;
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'> &
  DefaultProps;

export const Combobox = forwardRef<HTMLElement, ComboboxProps>(
  function Combobox({ className, multiple, onChange, ...rest }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const innerRef = useRef<HTMLElement>(null);
    const mergedRefs = useMergeRefs([innerRef, ref]);

    const randListId = useId();
    const [listId, setListId] = useState(randListId);

    // Handle onChange
    useEffect(() => {
      if (!multiple) {
        const div = innerRef.current as HTMLDivElement | null;
        /* Since we have a context, why not use `ref` for the input as well? */
        const handleChange = () =>
          onChange?.([div?.querySelector('input')?.value || '']);

        div?.addEventListener('input', handleChange);
        return () => div?.removeEventListener('input', handleChange);
      }

      const utags = innerRef.current as UHTMLTagsElement | null;
      const handleTags = (event: CustomEvent) => {
        const isAdd = event.detail.action === 'add';
        const value = event.detail.item.value;
        const prev = Array.from(utags?.items || [], ({ value }) => value);
        const next = isAdd
          ? prev.concat(value)
          : prev.filter((val) => val !== value);

        event.preventDefault(); // Prevent <u-tags> append/remove logic so we can control this with React useState
        onChange?.(next);
      };

      utags?.addEventListener('tags', handleTags);
      return () => utags?.removeEventListener('tags', handleTags);
    }, [multiple]);

    console.log(inputRef);

    return (
      <ComboboxContext.Provider value={{ listId, setListId, inputRef }}>
        {multiple ? (
          <u-tags
            class={cl('ds-combobox2', className)} // Using "class" since React does not translate className on custom elements
            ref={mergedRefs}
            {...rest}
          />
        ) : (
          <div
            className={cl('ds-combobox2', className)}
            ref={mergedRefs}
            {...rest}
          />
        )}
      </ComboboxContext.Provider>
    );
  },
);
