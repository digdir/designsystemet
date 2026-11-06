import type { DSSuggestionElement } from '@digdir/designsystemet-web';
import cl from 'clsx/lite';
import { forwardRef, useRef } from 'react';
import { useCustomEvents, useMergeRefs } from '../../utilities/hooks';

type SuggestionEvent<T> = CustomEvent<T> & {
  currentTarget: DSSuggestionElement;
};

export type SuggestionProps = {
  /**
   * Allows the user to create new items
   *
   * @default false
   */
  'data-creatable'?: boolean;
  /**
   * Allows the user to select multiple items
   *
   * @default false
   */
  'data-multiple'?: boolean;
  /**
   * The name of the associated form control
   *
   * @default undefined
   */
  name?: string;

  // Support React 18
  oncomboboxafterselect?: (e: SuggestionEvent<HTMLDataElement>) => void;
  oncomboboxbeforeselect?: (e: SuggestionEvent<HTMLDataElement>) => void;
  oncomboboxbeforematch?: (
    e: SuggestionEvent<HTMLOptionElement | undefined>,
  ) => void;
} & Omit<React.HTMLAttributes<DSSuggestionElement>, 'defaultValue'>;

export const Suggestion = forwardRef<DSSuggestionElement, SuggestionProps>(
  function Suggestion(
    {
      children,
      className,
      name,
      oncomboboxafterselect,
      oncomboboxbeforematch,
      oncomboboxbeforeselect,
      ...rest
    },
    ref,
  ) {
    const suggestionRef = useRef<DSSuggestionElement>(null);
    const mergedRefs = useMergeRefs([ref, suggestionRef]);

    // Support React 18
    useCustomEvents(suggestionRef, {
      comboboxafterselect: oncomboboxafterselect,
      comboboxbeforematch: oncomboboxbeforematch,
      comboboxbeforeselect: oncomboboxbeforeselect,
    });

    return (
      <ds-suggestion
        class={cl('ds-suggestion', className)} // Using "class" since React does not translate className on custom elements
        suppressHydrationWarning // Since <ds-suggestion> adds attributes
        ref={mergedRefs}
        {...rest}
      >
        {children}
        {/* Hidden select so it will be sent with a form */}
        {!!name && <select name={name} multiple hidden></select>}
      </ds-suggestion>
    );
  },
);
