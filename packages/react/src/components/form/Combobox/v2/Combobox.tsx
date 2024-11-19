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
import { Popover } from '../../../Popover';

/* I think we can always send a string array */
type ComboboxContextType = {
  listId?: string;
  setListId?: (id: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

export const ComboboxContext = createContext<ComboboxContextType>({});

export type ComboboxProps = {
  defaultValue?: string[];
  value?: string[];
  onChange: (values: string[]) => void;
  /**
   * Multiple options can be selected
   * @default false
   */
  multiple?: boolean;
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'> &
  DefaultProps;

export const Combobox = forwardRef<HTMLElement, ComboboxProps>(
  function Combobox(
    { className, multiple, defaultValue, onChange, ...rest },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const innerRef = useRef<HTMLElement>(null);
    const mergedRefs = useMergeRefs([innerRef, ref]);

    const [internalValue, setInternalValue] = useState<string[]>(
      defaultValue || [],
    );

    const randListId = useId();
    const [listId, setListId] = useState(randListId);

    // Handle onChange
    useEffect(() => {
      if (!multiple) {
        const div = innerRef.current as HTMLDivElement | null;
        /* Since we have a context, why not use `ref` for the input as well? */
        const handleChange = () => onChange?.([inputRef.current?.value || '']);

        div?.addEventListener('input', handleChange);
        return () => div?.removeEventListener('input', handleChange);
      }

      const utags = innerRef.current as UHTMLTagsElement | null;
      console.log(utags);
      const handleTags = (event: CustomEvent) => {
        const value = event.detail.item.value;
        console.log('new val', value);
        const next = internalValue.includes(value)
          ? internalValue.filter((v) => v !== value)
          : [...internalValue, value];

        setInternalValue(next);

        console.log({ internalValue, next });

        event.preventDefault(); // Prevent <u-tags> append/remove logic so we can control this with React useState
      };

      utags?.addEventListener('tags', handleTags);
      return () => utags?.removeEventListener('tags', handleTags);
    }, [multiple, internalValue]);

    // call onChange when internalValue changes
    useEffect(() => {
      onChange?.(internalValue);
    }, [internalValue, onChange]);

    // update internalValue when value changes
    useEffect(() => {
      if (rest.value) setInternalValue(rest.value);
    }, [rest.value]);

    return (
      <Popover.Context>
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
      </Popover.Context>
    );
  },
);
