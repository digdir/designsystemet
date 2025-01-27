import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type SuggestionEmptyProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
  }
>;

/**
 * Component that provides an empty suggestion list.
 *
 * Place as a descendant of `Suggestion.List`
 *
 * @example
 * <Suggestion.List>
 *   <Suggestion.Empty>Tomt</Suggestion.Empty>
 * </Suggestion.List>
 */
export const SuggestionEmpty = forwardRef<HTMLDivElement, SuggestionEmptyProps>(
  function SuggestionEmpty({ asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        aria-disabled='true'
        ref={ref}
        role='option'
        tabIndex={0}
        {...rest}
      />
    );
  },
);
