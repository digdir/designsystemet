import type { Color, SeverityColors } from '@digdir/designsystemet-types';
import type { Placement } from '@floating-ui/dom';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import '@digdir/designsystemet-web'; // Import _ds-floating functionality
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { useMergeRefs } from '../../utilities/hooks';
import { Context } from './popover-trigger-context';

export type PopoverProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * id to connect the trigger with the popover - required when not using Popover.Context.
     */
    id?: string;
    /**
     * Placement of the popover on the trigger.
     * @default 'top'
     */
    placement?: Placement;
    /**
     * When a boolean is provided, the popover will be controlled.
     * @default undefined
     */
    open?: boolean;
    /**
     * Change the background color of the popover.
     *
     * @default 'default'
     */
    variant?: 'default' | 'tinted';
    /**
     * Change the color scheme of the popover
     */
    'data-color'?: Color | SeverityColors;
    /**
     * Callback when the popover wants to open.
     */
    onOpen?: () => void;
    /**
     * Callback when the popover wants to close.
     */
    onClose?: () => void;
    /**
     * Whether to enable auto placement.
     * @default true
     */
    autoPlacement?: boolean;
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
  }
>;

/**
 * Popover component, used to display content in a popover over an element.
 *
 * @example with TriggerContext
 * <Popover.TriggerContext>
 *   <Popover.Trigger>Open Popover</Popover.Trigger>
 *   <Popover>
 *     Content
 *   </Popover>
 * </Popover.TriggerContext>
 *
 * @example without TriggerContext
 * <Button popovertarget="my-popover">Open Popover</Button>
 * <Popover id="my-popover">
 *   Content
 * </Popover>
 */

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      id,
      className,
      onClose,
      onOpen,
      open,
      variant = 'default',
      placement = 'top',
      autoPlacement = true,
      asChild = false,
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'div';
    const popoverRef = useRef<HTMLDivElement>(null);
    const mergedRefs = useMergeRefs([popoverRef, ref]);
    const { popoverId, setPopoverId } = useContext(Context);

    // useEffect(() => {
    //   let timeout: number | ReturnType<typeof setTimeout> | undefined;
    //   const el = popoverRef.current;
    //   const isControlled = open !== undefined;
    //   const isOpen = el?.matches(':popover-open,.\\:popover-open');
    //   const handleToggle = (event: Event & Partial<ToggleEvent>) => {
    //     if (isControlled) event.preventDefault();
    //     if (event.type !== 'beforetoggle') onClose?.();
    //     else if (event.newState === 'open') onOpen?.();
    //   };

    //   // Sync if controlled and state differs, but with setTimeout to avoid conflict with React render loop
    //   if (isControlled && el && open !== isOpen)
    //     timeout = setTimeout(() => {
    //       el.removeEventListener('beforetoggle', handleToggle); // Stop listening "beforetoggle" event during programmatic toggling
    //       const source = `[popovertarget="${el.id}"],[command="${el.id}"]`;
    //       const options = { detail: document.querySelector(source) };
    //       el.togglePopover(open);
    //       el.dispatchEvent(new CustomEvent('ds-toggle-source', options)); // Since togglePopover({ source }) is not supported in all browsers yet
    //       requestAnimationFrame(
    //         () => el.addEventListener('beforetoggle', handleToggle), // Listen for "beforetoggle" event again when done toggling
    //       );
    //     });

    //   el?.addEventListener('beforetoggle', handleToggle);
    //   el?.addEventListener('ds-toggle-close', handleToggle);
    //   return () => {
    //     clearTimeout(timeout);
    //     el?.removeEventListener('beforetoggle', handleToggle);
    //     el?.removeEventListener('ds-toggle-close', handleToggle);
    //   };
    // }, [open]);

    // Update context with id
    useEffect(() => {
      if (id) setPopoverId?.(id);
    }, [id]);

    return (
      <Component
        className={cl('ds-popover', className)}
        id={id || popoverId}
        popover='manual'
        data-placement={placement}
        data-variant={variant}
        ref={mergedRefs}
        suppressHydrationWarning // Since _ds-floating adds attributes
        {...rest}
      />
    );
  },
);

// function handleBeforeToggle({ target: el, newState }: Partial<ToggleEvent>) {
//   if (newState === 'open' && el instanceof HTMLElement && getDSFloating(el))
//     attr(el, 'popover', 'manual'); // Make manual to prevent closing when clicking scrollbar
// }

// Since we use manual popover, we also manually need to close on outside click
// function handleClick(event: Event) {
//   for (const [popover] of POPOVERS)
//     if (!popover.contains(event.target as Node)) {
//       const trigger = `[popovertarget="${popover.id}"],[commandfor="${popover.id}"]`;
//       const isTriggerElement = (event.target as Element)?.closest?.(trigger);
//       if (isTriggerElement) event.preventDefault(); // Prevent native Popover API so we can trigger our own, cancelable close event
//       const options = { cancelable: true, detail: popover };
//       const close = new CustomEvent('ds-toggle-close', options);
//       if (popover.dispatchEvent(close)) popover.hidePopover(); // Allowing preventDefault to stop closing
//     }
// }

// function handleKeydown(event: Partial<KeyboardEvent>) {
//   const last = event.key === 'Escape' && Array.from(POPOVERS.keys()).pop();
//   if (last) last.hidePopover();
//   if (last) event.preventDefault?.(); // Prevent minimize fullscreen Safari
// }
// on(document, 'beforetoggle', handleBeforeToggle, QUICK_EVENT), // Use capture since toggle does not bubble
// on(document, 'click', handleClick, true), // Close open popovers on outside click
// on(document, 'keydown', handleKeydown),
