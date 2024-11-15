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

type OnChangeMultiple = (values: string[]) => void;
type OnChangeSingle = (value: string) => void;
type MultipleProps = Omit<HTMLAttributes<UHTMLTagsElement>, 'onChange'>;
type SingleProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>;

type ComboboxContextType = {
  listId?: string;
  setListId?: (id: string) => void;
};

export const ComboboxContext = createContext<ComboboxContextType>({});

export type ComboboxProps = {
  onChange: OnChangeSingle | OnChangeMultiple;
  /**
   * Multiple options can be selected
   * @default false
   */
  multiple?: boolean;
} & DefaultProps &
  (
    | ({ multiple: true; onChange: OnChangeMultiple } & MultipleProps)
    | ({ multiple?: false | never; onChange: OnChangeSingle } & SingleProps)
  );

export const Combobox = forwardRef<HTMLElement, ComboboxProps>(
  function Combobox({ className, multiple, onChange, ...rest }, ref) {
    const [listId, setListId] = useState(useId());
    const innerRef = useRef<UHTMLTagsElement | HTMLDivElement>(null);
    const mergedRefs = useMergeRefs([innerRef, ref]);

    // Handle onChange
    useEffect(() => {
      if (!multiple) {
        const div = innerRef.current as HTMLDivElement | null;
        const handleChange = () =>
          onChange?.(div?.querySelector('input')?.value || '');

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

    return (
      <ComboboxContext.Provider value={{ listId, setListId }}>
        {multiple ? (
          <u-tags
            class={cl('ds-combobox2', className)} // Using "class" since React does not translate className on custom elements
            ref={mergedRefs}
            {...(rest as MultipleProps)}
          />
        ) : (
          <div
            className={cl('ds-combobox2', className)}
            ref={mergedRefs}
            {...(rest as SingleProps)}
          />
        )}
      </ComboboxContext.Provider>
    );
  },
);
