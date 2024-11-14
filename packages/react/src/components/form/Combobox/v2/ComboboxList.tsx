import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect } from 'react';
import '@u-elements/u-datalist';

import type { DefaultProps } from '../../../../types';
import { ComboboxContext } from './Combobox';

export type ComboboxListProps = HTMLAttributes<HTMLDataListElement> &
  DefaultProps;

export const ComboboxList = forwardRef<HTMLDataListElement, ComboboxListProps>(
  function ComboboxList({ className, id, ...rest }, ref) {
    const { listId, setListId } = useContext(ComboboxContext);

    useEffect(() => {
      if (id && listId !== id) setListId?.(id);
    }, [listId, id, setListId]);

    // Using "class" since React does not translate className on custom elements
    return <u-datalist class={className} id={listId} ref={ref} {...rest} />;
  },
);
