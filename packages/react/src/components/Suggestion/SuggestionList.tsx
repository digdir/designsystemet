import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect } from 'react';
import '@u-elements/u-datalist';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { SuggestionContext } from './Suggestion';

export type SuggestionListProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDataListElement>,
  {
    /**
     * The screen reader announcement for singular suggestion, where %d is the number of suggestions
     * @default '%d forslag'
     */
    singular?: string;
    /**
     * The screen reader announcement for plural suggestions, where %d is the number of suggestions
     * @default '%d forslag'
     */
    plural?: string;
  }
>;

/**
 * Component that provides a suggestion list.
 *
 * Place as a descendant of `Suggestion`
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.List />
 * </Suggestion>
 */
export const SuggestionList = forwardRef<
  HTMLDataListElement,
  SuggestionListProps
>(function SuggestionList(
  { singular = '%d forslag', plural = '%d forslag', className, id, ...rest },
  ref,
) {
  const { inputRef, listId, setListId, handleFilter } =
    useContext(SuggestionContext);

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
