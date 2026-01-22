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

    // TODO: Controlled popover respecting forced true or false state
    // useEffect(() => {
    //   let IGNORE_OPEN_EVENT = false;
    //   const isControlled = open !== undefined;
    //   const isOpen = popoverRef.current?.matches(
    //     ':popover-open,.\\:popover-open',
    //   );
    //   const handleToggle = (event: Event & Partial<ToggleEvent>) => {
    //     const nextOpen = event.newState === 'open';
    //     console.log({
    //       IGNORE_OPEN_EVENT,
    //       type: event.type,
    //       nextOpen,
    //       isOpen,
    //       open,
    //     });
    //     if (IGNORE_OPEN_EVENT) return;
    //     if (isControlled && nextOpen !== open) event.preventDefault();
    //     if (event.type !== 'beforetoggle') onClose?.();
    //     else if (event.newState === 'open') onOpen?.();
    //   };

    //   console[open === isOpen ? 'log' : 'warn']({ open, isOpen });
    //   if (isControlled && open !== isOpen)
    //     requestAnimationFrame(() => {
    //       IGNORE_OPEN_EVENT = true;
    //       capture('beforetoggle', handleToggle, false); // Ignore the next open event since we are controlling it
    //       popoverRef.current?.togglePopover(open);
    //       requestAnimationFrame(() => {
    //         IGNORE_OPEN_EVENT = false; // Listen for events again
    //       });
    //     }); // Sync state if controlled, but with requestAnimationFrame to avoid conflict with React render loop

    //   return capture('beforetoggle ds-toggle-close', handleToggle);
    // }, [open]);

    // useEffect(() => {}, [open]);
    // const [internalOpen, setInternalOpen] = useState(false);

    // NOTE: This code is purely to add React controlled component ability to Popover API
    // useEffect(() => {
    //   const popover = popoverRef.current;
    //   const handleClick = (event: MouseEvent) => {
    //     const el = event.target as Element | null;
    //     const isTrigger = el?.closest?.(`[popovertarget="${popover?.id}"]`);
    //     const isOutside = !isTrigger && !popover?.contains(el as Node);

    //     if (isTrigger) {
    //       event.preventDefault(); // Prevent native Popover API
    //     }
    //     if (controlledOpen && (isTrigger || isOutside)) {
    //       setInternalOpen(false);
    //       onClose?.();
    //     } else if (!controlledOpen && isTrigger) {
    //       setInternalOpen(true);
    //       onOpen?.();
    //     }
    //   };

    //   const handleKeydown = (event: KeyboardEvent) => {
    //     if (event.key !== 'Escape' || !controlledOpen) return;
    //     event.preventDefault(); // Prevent closing fullscreen in Safari
    //     setInternalOpen(false);
    //     onClose?.();
    //   };

    //   popover?.togglePopover?.(controlledOpen);
    //   document.addEventListener('click', handleClick, true); // Use capture to execute before React event API
    //   document.addEventListener('keydown', handleKeydown);
    //   return () => {
    //     document.removeEventListener('click', handleClick, true);
    //     document.removeEventListener('keydown', handleKeydown);
    //   };
    // }, [controlledOpen]);

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

/**
 * capture
 * @param el The Element to use as EventTarget
 * @param types A space separated string of event types
 * @param fn An function to trigger on listeners
 * @param add Whether to add or remove the event listener
 * @returns A function to remove the event listeners
 */
export const capture = (
  types: string,
  fn: (event: Event) => void,
  add = true,
): (() => void) => {
  console.log(types, add);
  for (const type of types.split(' '))
    document[`${add ? 'add' : 'remove'}EventListener`](type, fn, true); // Use capture to catch all events
  return () => capture(types, fn, false);
};
