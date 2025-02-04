import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect } from 'react';
import '@u-elements/u-datalist';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { MultiSelectContext } from './MultiSelect';

export type MultiSelectListProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDataListElement>,
  {
    /**
     * The screen reader announcement for singular MultiSelect, where %d is the number of MultiSelects
     * @default '%d forslag'
     */
    singular?: string;
    /**
     * The screen reader announcement for plural MultiSelects, where %d is the number of MultiSelects
     * @default '%d forslag'
     */
    plural?: string;
  }
>;

/**
 * Component that provides a MultiSelect list.
 *
 * Place as a descendant of `MultiSelect`
 *
 * @example
 * <MultiSelect>
 *   <MultiSelect.Input />
 *   <MultiSelect.List />
 * </MultiSelect>
 */
export const MultiSelectList = forwardRef<
  HTMLDataListElement,
  MultiSelectListProps
>(function MultiSelectList(
  { singular = '%d forslag', plural = '%d forslag', className, id, ...rest },
  ref,
) {
  const { inputRef, listId, setListId, handleFilter } =
    useContext(MultiSelectContext);

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
