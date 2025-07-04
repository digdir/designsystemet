import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { useMergeRefs } from '../../utilities/hooks';
import '@u-elements/u-details';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type DetailsProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDetailsElement>,
  {
    /**
     * Change the background color of the details.
     *
     * @default 'default'
     */
    variant?: 'default' | 'tinted';
    /**
     * Controls open-state.
     *
     * Using this removes automatic control of open-state
     *
     * @default undefined
     */
    open?: boolean;
    /**
     * Defaults the details to open if not controlled
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Callback function when Details toggles due to click on summary or find in page-search
     */
    onToggle?: (event: Event) => void;
    /**
     * Content should be one `<Details.Summary>` and `<Details.Content>`
     */
    children?: ReactNode;
  }
> &
  (
    | { open: boolean; onToggle: (event: Event) => void }
    | { open?: never; onToggle?: (event: Event) => void }
  );

/**
 * Details component, contains `Details.Summary` and `Details.Content` components.
 *
 * @example
 * <Details>
 *  <Details.Summary>Header</Details.Summary>
 *  <Details.Content>Content</Details.Content>
 * </Details>
 */
export const Details = forwardRef<HTMLDetailsElement, DetailsProps>(
  function Details(
    {
      className,
      open,
      defaultOpen = false,
      variant = 'default',
      onToggle,
      ...rest
    },
    ref,
  ) {
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const initialOpen = useRef(defaultOpen); // Allow rendering defaultOpen on server, but only render once on client
    const mergedRefs = useMergeRefs([detailsRef, ref]);
    const onToggleRef = useRef(onToggle); // Using ref to enable access inside useEffect without re-binding event listeners
    const openRef = useRef(open);
    onToggleRef.current = onToggle;
    openRef.current = open;

    // Provide onToggle event and controlled state
    useEffect(() => {
      const details = detailsRef.current;
      const handleToggle = (event: Event) => {
        if (!details || details?.open === openRef.current) return;
        onToggleRef.current?.(event);
        if (openRef.current !== undefined) details.open = openRef.current; // Don't update DOM unless controlled state changes
      };

      details?.addEventListener('toggle', handleToggle, true);
      return () => details?.removeEventListener('toggle', handleToggle, true);
    }, []);

    return (
      <u-details
        class={cl('ds-details', className)} // Using class since React does not translate className on custom elements
        open={(open ?? initialOpen.current) || undefined} // Fallback to undefined to prevent rendering open="false"
        data-variant={variant}
        ref={mergedRefs}
        {...rest}
      />
    );
  },
);
