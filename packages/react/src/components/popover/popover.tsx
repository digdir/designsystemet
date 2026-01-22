import type { Color, SeverityColors } from '@digdir/designsystemet-types';
import type { Placement } from '@floating-ui/dom';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
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
    const [internalOpen, setInternalOpen] = useState(false);
    const controlledOpen = open ?? internalOpen;

    // NOTE: This code is purely to add React controlled component ability to Popover API
    useEffect(() => {
      const popover = popoverRef.current;
      const trigger = `[popovertarget="${popover?.id}"],[commandfor="${popover?.id}"]`;
      const handleClick = (event: MouseEvent) => {
        const el = event.target as Element | null;
        const isTrigger = el?.closest?.(trigger);
        const isOutside = !isTrigger && !popover?.contains(el as Node);

        if (isTrigger) event.preventDefault(); // Prevent native Popover API
        if (controlledOpen && (isTrigger || isOutside)) {
          setInternalOpen(false);
          onClose?.();
        } else if (!controlledOpen && isTrigger) {
          setInternalOpen(true);
          onOpen?.();
        }
      };

      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !controlledOpen) return;
        event.preventDefault(); // Prevent closing fullscreen in Safari
        setInternalOpen(false);
        onClose?.();
      };

      popover?.togglePopover?.(controlledOpen);
      if (controlledOpen) {
        const options = { detail: document.querySelector(trigger) };
        popover?.dispatchEvent(new CustomEvent('ds-toggle-source', options)); // Since togglePopover({ source }) is not supported in all browsers yet
      }

      document.addEventListener('click', handleClick, true); // Use capture to execute before React event API
      document.addEventListener('keydown', handleKeydown);
      return () => {
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('keydown', handleKeydown);
      };
    }, [controlledOpen]);

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
