import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import '@digdir/designsystemet-web/ds-suggestion'; // Load ds-suggestion and u-datalist polyfill
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type SuggestionListProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDataListElement>,
  {
    /**
     * Set to true to allow custom filtering
     */
    'data-nofilter'?: boolean;
    /**
     * Whether to enable auto placement.
     */
    'data-autoplacement'?: boolean;
    /**
     * Whether to enable auto placement.
     * @deprecated Please use `data-autoplacement` instead
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
>(function SuggestionList({ autoPlacement, className, ...rest }, ref) {
  return (
    <u-datalist
      class={className} // Using "class" since React does not translate className on custom elements
      data-autoplacement={autoPlacement || undefined}
      suppressHydrationWarning // Since <u-datalist> adds attributes
      ref={ref}
      {...rest}
    />
  );
});
