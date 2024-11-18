import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import '@u-elements/u-datalist';

import { useMergeRefs } from '@floating-ui/react';
import type { DefaultProps } from '../../../../types';
import { Popover } from '../../../Popover';
import { ComboboxContext } from './Combobox';

export type ComboboxListProps = HTMLAttributes<HTMLDataListElement> &
  DefaultProps;

export const ComboboxList = forwardRef<HTMLDataListElement, ComboboxListProps>(
  function ComboboxList({ className, id, ...rest }, ref) {
    const { listId, setListId } = useContext(ComboboxContext);

    const listRef = useRef<HTMLDataListElement>(null);
    const mergedRefs = useMergeRefs([listRef, ref]);

    const [open, setOpen] = useState(false);

    /* if listRef does not have hidden, it is open */
    useEffect(() => {
      const observer = new MutationObserver((cb) => {
        for (const mutation of cb) {
          console.log({ mutation });
          if (mutation.attributeName === 'hidden') {
            setOpen(!(mutation.target as Element).hasAttribute('hidden'));
          }
        }
      });

      observer.observe(listRef.current as Node, {
        attributes: true,
        childList: false,
        subtree: false,
      });

      return () => observer.disconnect();
    }, [listRef]);

    console.log({ open });

    useEffect(() => {
      if (id && listId !== id) setListId?.(id);
    }, [listId, id, setListId]);

    // Using "class" since React does not translate className on custom elements
    return (
      <Popover placement='bottom' open={open}>
        <u-datalist class={className} id={listId} ref={mergedRefs} {...rest} />
      </Popover>
    );
  },
);
