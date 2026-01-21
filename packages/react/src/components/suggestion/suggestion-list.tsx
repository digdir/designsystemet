import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect } from 'react';
import '@digdir/designsystemet-web'; // Load u-datalist polyfill
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { SuggestionContext } from './suggestion';

export type SuggestionListProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDataListElement>,
  {
    /**
     * The screen reader announcement for singular Suggestion, where %d is the number of Suggestions
     * @default '%d forslag'
     */
    singular?: string;
    /**
     * The screen reader announcement for plural Suggestions, where %d is the number of Suggestions
     * @default '%d forslag'
     */
    plural?: string;
    /**
     * Whether to enable auto placement.
     * @default true
     */
    autoPlacement?: boolean;
  }
>;

/**
 * Component that provides a Suggestion list.
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
  {
    singular = '%d forslag',
    plural = '%d forslag',
    className,
    id,
    autoPlacement = true,
    ...rest
  },
  ref,
) {
  const { handleFilter } = useContext(SuggestionContext);

  useEffect(handleFilter); // Must run on every render

  return (
    <u-datalist
      class={className} // Using "class" since React does not translate className on custom elements
      data-nofilter
      data-sr-plural={plural}
      data-sr-singular={singular}
      popover='manual'
      ref={ref}
      suppressHydrationWarning // Since <u-datalist> adds attributes
      {...rest}
    />
  );
});
