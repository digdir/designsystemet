import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect } from 'react';
import '@u-elements/u-datalist';
import { useMergeRefs } from '@floating-ui/react';
import type { DefaultProps } from '../../types';
import { SuggestionContext } from './Suggestion';

export type SuggestionListProps = HTMLAttributes<HTMLDataListElement> &
  DefaultProps;

export const SuggestionList = forwardRef<
  HTMLDataListElement,
  SuggestionListProps
>(function SuggestionList({ className, id, ...rest }, ref) {
  const { listId, setListId, listRef } = useContext(SuggestionContext);

  const mergedRefs = useMergeRefs([listRef, ref]);

  useEffect(() => {
    if (id && listId !== id) setListId?.(id);
  }, [listId, id, setListId]);

  return (
    <u-datalist
      class={className} // Using "class" since React does not translate className on custom elements
      id={listId}
      ref={mergedRefs}
      {...rest}
    />
  );
});
