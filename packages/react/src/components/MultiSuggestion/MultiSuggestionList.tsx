import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect } from 'react';
import '@u-elements/u-datalist';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { MultiSuggestionContext } from './MultiSuggestion';

export type MultiSuggestionListProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDataListElement>,
  {
    /**
     * The screen reader announcement for singular MultiSuggestion, where %d is the number of MultiSuggestions
     * @default '%d forslag'
     */
    singular?: string;
    /**
     * The screen reader announcement for plural MultiSuggestions, where %d is the number of MultiSuggestions
     * @default '%d forslag'
     */
    plural?: string;
  }
>;

/**
 * Component that provides a MultiSuggestion list.
 *
 * Place as a descendant of `MultiSuggestion`
 *
 * @example
 * <MultiSuggestion>
 *   <MultiSuggestion.Input />
 *   <MultiSuggestion.List />
 * </MultiSuggestion>
 */
export const MultiSuggestionList = forwardRef<
  HTMLDataListElement,
  MultiSuggestionListProps
>(function MultiSuggestionList(
  { singular = '%d forslag', plural = '%d forslag', className, id, ...rest },
  ref,
) {
  const { inputRef, listId, setListId, handleFilter } = useContext(
    MultiSuggestionContext,
  );

  useEffect(() => handleFilter?.(inputRef?.current)); // Must run on every render
  useEffect(() => {
    if (id && listId !== id) setListId?.(id);
  }, [listId, id, setListId]);

  return (
    <u-datalist
      data-sr-singular={singular}
      data-sr-plural={plural}
      class={className} // Using "class" since React does not translate className on custom elements
      id={listId}
      ref={ref}
      {...rest}
    />
  );
});
