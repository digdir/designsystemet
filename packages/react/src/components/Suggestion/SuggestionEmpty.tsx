import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type SuggestionEmptyProps = HTMLAttributes<HTMLDivElement> &
  DefaultProps;
export const SuggestionEmpty = forwardRef<HTMLDivElement, SuggestionEmptyProps>(
  function SuggestionEmpty(rest, ref) {
    return (
      <div
        // aria-disabled='true'// this causes error with ds-field
        ref={ref}
        role='option'
        tabIndex={0}
        {...rest}
      />
    );
  },
);
