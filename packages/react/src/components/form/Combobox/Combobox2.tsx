import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type {
  DataHTMLAttributes,
  HTMLAttributes,
  OptionHTMLAttributes,
} from 'react';
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import '@u-elements/u-datalist';
import '@u-elements/u-tags';
import type { UHTMLTagsElement } from '@u-elements/u-tags';

import type { DefaultProps } from '../../../types';
import { Chip } from '../../Chip';

export const Combobox2Context = createContext<{
  listId?: string;
  setListId?: (id: string) => void;
}>({});

export type Combobox2Props = HTMLAttributes<UHTMLTagsElement> & DefaultProps;
export const Combobox2Comp = forwardRef<UHTMLTagsElement, Combobox2Props>(
  function Combobox2({ className, ...rest }, ref) {
    const [listId, setListId] = useState(useId());

    // Using class since React does not translate className on custom elements
    return (
      <Combobox2Context.Provider value={{ listId, setListId }}>
        <u-tags
          class={cl('ds-combobox2 ds-input', className)}
          ref={ref}
          {...rest}
        />
      </Combobox2Context.Provider>
    );
  },
);

export type Combobox2ChipProps = DataHTMLAttributes<HTMLDataElement> &
  DefaultProps;
export const Combobox2Chip = forwardRef<HTMLDataElement, Combobox2ChipProps>(
  function Combobox2Chip(rest, ref) {
    return (
      <Chip.Removable asChild>
        <data ref={ref} {...rest} />
      </Chip.Removable>
    );
  },
);

export type Combobox2ListProps = HTMLAttributes<HTMLDataListElement> &
  DefaultProps;
export const Combobox2List = forwardRef<
  HTMLDataListElement,
  Combobox2ListProps
>(function Combobox2List({ id, ...rest }, ref) {
  const { listId, setListId } = useContext(Combobox2Context);
  const listRef = useRef<HTMLDataListElement>(null);
  const mergedRefs = useMergeRefs([listRef, ref]);

  useEffect(() => {
    if (id && listId !== id) setListId?.(id);
  }, [listId, id, setListId]);

  return <u-datalist ref={listRef} id={listId} {...rest} />;
});

export type Combobox2OptionProps = OptionHTMLAttributes<HTMLOptionElement> &
  DefaultProps;
export const Combobox2Option = forwardRef<
  HTMLOptionElement,
  Combobox2OptionProps
>(function Combobox2Option({ className, ...rest }, ref) {
  return <u-option class={className} ref={ref} {...rest} />;
});

export const Combobox2 = Object.assign(Combobox2Comp, {
  Chip: Combobox2Chip,
  List: Combobox2List,
  Option: Combobox2Option,
});
