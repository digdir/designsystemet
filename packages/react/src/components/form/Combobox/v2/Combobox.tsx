import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import {
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

type ComboboxContextType = {
  listId?: string;
  setListId?: (id: string) => void;
};
export const ComboboxContext = createContext<ComboboxContextType>({});

export type ComboboxProps = {
  onChange: (nextValues: string[], prevValues: string[]) => void;
} & Omit<HTMLAttributes<UHTMLTagsElement>, 'onChange'> &
  DefaultProps;
export const Combobox = forwardRef<UHTMLTagsElement, ComboboxProps>(
  function Combobox({ className, onChange, ...rest }, ref) {
    const [listId, setListId] = useState(useId());
    const tagsRef = useRef<UHTMLTagsElement>(null);
    const mergedRefs = useMergeRefs([tagsRef, ref]);

    useEffect(() => {
      const tags = tagsRef.current;
      const onTags = (event: CustomEvent) => {
        const isAdd = event.detail.action === 'add';
        const value = event.detail.item.value;
        const prevValues = Array.from(tags?.items || [], ({ value }) => value);
        const nextValues = isAdd
          ? prevValues.concat(value)
          : prevValues.filter((val) => val !== value);

        event.preventDefault(); // Prevent <u-tags> append/remove logic so we can control this with React useState
        onChange?.(nextValues, prevValues);
      };

      tags?.addEventListener('tags', onTags);
      return () => tags?.removeEventListener('tags', onTags);
    });

    // Using "class" since React does not translate className on custom elements
    return (
      <ComboboxContext.Provider value={{ listId, setListId }}>
        <u-tags
          class={cl('ds-combobox2', className)}
          ref={mergedRefs}
          {...rest}
        />
      </ComboboxContext.Provider>
    );
  },
);
