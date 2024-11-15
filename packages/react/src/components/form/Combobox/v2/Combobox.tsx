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

type OnChangeMultiple = (nextValues: string[], prevValues: string[]) => void;
type OnChangeSingle = (nextValue: string, prevValue: string) => void;
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
    | ({
        multiple: true;
        onChange: OnChangeMultiple;
      } & Omit<HTMLAttributes<UHTMLTagsElement>, 'onChange'>)
    | ({
        multiple?: false | never;
        onChange: OnChangeSingle;
      } & Omit<HTMLAttributes<HTMLElement>, 'onChange'>)
  );

export const Combobox = forwardRef<HTMLElement, ComboboxProps>(
  function Combobox({ className, multiple, onChange, ...rest }, ref) {
    const [listId, setListId] = useState(useId());
    const wrapperRef = useRef<HTMLElement>(null);
    const mergedRefs = useMergeRefs([wrapperRef, ref]);

    useEffect(() => {
      const wrapper = wrapperRef.current;
      const onTags = (event: CustomEvent) => {
        const input = wrapper?.querySelector('input');
        const isAdd = event.detail.action === 'add';
        const value = event.detail.item.value;
        const prevValues = Array.from(
          (wrapper as UHTMLTagsElement)?.items || [],
          ({ value }) => value,
        );
        const nextValues = isAdd
          ? prevValues.concat(value)
          : prevValues.filter((val) => val !== value);

        event.preventDefault(); // Prevent <u-tags> append/remove logic so we can control this with React useState

        if (multiple) onChange?.(nextValues, prevValues);
        else onChange?.(value, input?.value || '');
      };

      wrapper?.addEventListener('tags', onTags); // TODO: change onChange on input
      return () => wrapper?.removeEventListener('tags', onTags);
    }, [multiple]);

    // Using "class" since React does not translate className on custom elements
    return (
      <ComboboxContext.Provider value={{ listId, setListId }}>
        {multiple ? (
          <u-tags
            class={cl('ds-combobox2', className)}
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
