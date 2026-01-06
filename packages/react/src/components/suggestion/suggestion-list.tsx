import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect } from 'react';
import '@u-elements/u-datalist';
import {
  autoUpdate,
  computePosition,
  flip,
  type MiddlewareState,
  shift,
} from '@floating-ui/dom';
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
  const { handleFilter, uComboboxRef } = useContext(SuggestionContext);

  useEffect(handleFilter); // Must run on every render

  // Position with floating-ui
  useEffect(() => {
    const trigger = uComboboxRef?.current?.control;
    const list = uComboboxRef?.current?.list;

    if (list && trigger) {
      return autoUpdate(trigger, list, () => {
        computePosition(trigger, list, {
          placement: 'bottom',
          strategy: 'fixed',
          middleware: [
            ...(autoPlacement
              ? [flip({ fallbackAxisSideDirection: 'start' }), shift()]
              : []),
            undefined,
            triggerWidth,
          ],
        }).then(({ x, y, placement }) => {
          const varOperator = placement.startsWith('top') ? '-' : '+';
          list.style.translate = `${Math.round(x)}px calc(${Math.round(y)}px ${varOperator} var(--dsc-suggestion-list-gap))`;
        });
      });
    }
  }, []);

  return (
    <u-datalist
      data-nofilter
      data-sr-singular={singular}
      data-sr-plural={plural}
      class={className} // Using "class" since React does not translate className on custom elements
      ref={ref}
      popover='manual'
      {...rest}
    />
  );
});

const triggerWidth = {
  name: 'TriggerWidth',
  fn(data: MiddlewareState) {
    const { elements, rects } = data;
    elements.floating.style.width = `${rects.reference.width}px`;
    return data;
  },
};
