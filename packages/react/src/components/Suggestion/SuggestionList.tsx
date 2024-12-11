import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import '@u-elements/u-datalist';

import { useMergeRefs } from '@floating-ui/react';
import type { DefaultProps } from '../../types';
import { Popover } from '../Popover';
import { SuggestionContext } from './Suggestion';

export type SuggestionListProps = HTMLAttributes<HTMLDataListElement> &
  DefaultProps;

export const SuggestionList = forwardRef<
  HTMLDataListElement,
  SuggestionListProps
>(function SuggestionList({ className, id, ...rest }, ref) {
  const { listId, setListId } = useContext(SuggestionContext);

  const localRef = useRef<HTMLDataListElement>(null);
  const [open, setOpen] = useState(true);

  const mergedRefs = useMergeRefs([localRef, ref]);

  useEffect(() => {
    if (id && listId !== id) setListId?.(id);
  }, [listId, id, setListId]);

  /* if listRef does not have hidden, it is open */
  useEffect(() => {
    const observer = new MutationObserver((cb) => {
      for (const mutation of cb) {
        if (mutation.attributeName === 'hidden') {
          setOpen(!(mutation.target as Element).hasAttribute('hidden'));
        }
      }
    });

    observer.observe(localRef.current as Node, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, [localRef]);

  return (
    <Popover placement='bottom' open={open}>
      <u-datalist
        class={className} // Using "class" since React does not translate className on custom elements
        id={listId}
        ref={mergedRefs}
        {...rest}
      />
    </Popover>
  );
});
