import type { DSSuggestionElement } from '@digdir/designsystemet-web';
import cl from 'clsx/lite';
import { forwardRef, useEffect, useRef } from 'react';
import { warn } from '../../utilities';
import { useEventListener, useMergeRefs } from '../../utilities/hooks';

/* Props removed from Suggestion, and what to use instead */
const WARNED = new Set<string>(); // Warn only once per prop, even with many instances
const REMOVED_PROPS = Object.entries({
  selected: 'render <data> children and use oncomboboxbeforeselect',
  defaultSelected: 'render the initial <data> as children',
  onSelectedChange: 'use oncomboboxbeforeselect with the suggestion() helper',
  renderSelected: 'render the content of each <data> yourself',
  multiple: 'use data-multiple',
  creatable: 'use data-creatable',
  filter: 'use data-nofilter on Suggestion.List',
  onBeforeMatch: 'use oncomboboxbeforematch',
});

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

      // Removed properties
      selected,
      defaultSelected,
      onSelectedChange,
      renderSelected,
      multiple,
      creatable,
      filter,
      onBeforeMatch,
      ...rest
    }: SuggestionProps & Record<string, unknown>,
    ref,
  ) {
    const selfRef = useRef<DSSuggestionElement>(null);
    const mergedRefs = useMergeRefs([ref, selfRef]);

    // Support React 18
    useEventListener('comboboxafterselect', oncomboboxafterselect, selfRef);
    useEventListener('comboboxbeforematch', oncomboboxbeforematch, selfRef);
    useEventListener('comboboxbeforeselect', oncomboboxbeforeselect, selfRef);

    // Warn about removed props, as they are silently ignored
    useEffect(() => {
      for (const [prop, fix] of REMOVED_PROPS)
        if (prop in rest && !WARNED.has(prop) && WARNED.add(prop))
          warn(`Suggestion: "${prop}" is removed, ${fix}.`);
    }, []);

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
