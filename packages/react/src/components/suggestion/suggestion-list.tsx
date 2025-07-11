import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useId, useRef } from 'react';
import '@u-elements/u-datalist';
import {
  autoUpdate,
  computePosition,
  type MiddlewareState,
} from '@floating-ui/dom';
import { useMergeRefs } from '@floating-ui/react';
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
  { singular = '%d forslag', plural = '%d forslag', className, id, ...rest },
  ref,
) {
  const { listId, setListId, handleFilter } = useContext(SuggestionContext);
  const listRef = useRef<HTMLDataListElement>(null);
  const mergedRefs = useMergeRefs([ref, listRef]);

  const genId = useId();

  useEffect(handleFilter); // Must run on every render

  useEffect(() => {
    if (listId) {
      setListId(id || genId);
    }
  }, [id, listId, setListId]);

  // Position with floating-ui
  useEffect(() => {
    const popover = listRef.current;
    const trigger = document.querySelector(
      `[popovertarget="${popover?.id}"]`,
    ) as HTMLInputElement;

    if (popover && trigger) {
      return autoUpdate(trigger, popover, () => {
        computePosition(trigger, popover, {
          placement: 'bottom',
          strategy: 'fixed',
          middleware: [triggerWidth],
        }).then(({ x, y }) => {
          popover.style.translate = `${x}px calc(${y}px + var(--dsc-suggestion-list-gap))`;
          console.log([x, y]);
        });
      });
    }
  }, [listId]);

  return (
    <u-datalist
      data-nofilter
      data-sr-singular={singular}
      data-sr-plural={plural}
      class={className} // Using "class" since React does not translate className on custom elements
      ref={mergedRefs}
      id={listId}
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
