import type { HTMLAttributes } from 'react';
import type React from 'react';
import {
  useRef,
  useState,
  useMemo,
  createContext,
  useContext,
  forwardRef,
  isValidElement,
  cloneElement,
} from 'react';
import type { Placement } from '@floating-ui/react';
import {
  arrow as flArrow,
  useFloating,
  autoUpdate,
  offset as flOffset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';
import cl from 'clsx';

import classes from './Popover.module.css';

export const popoverVariants = [
  'default',
  'info',
  'warning',
  'danger',
] as const;

type PopoverVariant_ = (typeof popoverVariants)[number];

interface IPopoverOptions extends HTMLAttributes<HTMLDivElement> {
  variant?: PopoverVariant_;
  arrow?: boolean;
  offset?: number;
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface IPopoverRequiredProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export type LegacyPopoverProps = IPopoverOptions & IPopoverRequiredProps;

type IPopoverContext = IPopoverOptions &
  Required<Pick<IPopoverOptions, 'variant'>> &
  ReturnType<typeof useInteractions> &
  ReturnType<typeof useFloating<HTMLDivElement>> & {
    arrowRef: React.RefObject<HTMLDivElement>;
    setOpen: (open: boolean) => void;
  };

export function usePopover({
  variant = 'default',
  arrow,
  initialOpen,
  placement,
  offset: offset,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  ...restOptions
}: IPopoverOptions): IPopoverContext {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const arrowRef = useRef<HTMLDivElement | null>(null);

  const data = useFloating<HTMLDivElement>({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      flOffset(offset ?? (arrow ? 12 : 4)),
      flip({ padding: 5, fallbackPlacements: ['bottom', 'top'] }),
      shift({ padding: 5 }),
      flArrow({ element: arrowRef, padding: 8 }),
    ],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context, {
    referencePress: false,
  });
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return useMemo<IPopoverContext>(
    () =>
      ({
        open,
        setOpen,
        ...interactions,
        ...data,
        ...restOptions,
        arrow,
        arrowRef,
        variant,
      } satisfies IPopoverContext),
    [open, setOpen, interactions, data, restOptions, arrow, arrowRef, variant],
  );
}

type NullablePopoverContext = IPopoverContext | null;

const PopoverContext = createContext<NullablePopoverContext>(null);

export const usePopoverContext = (): IPopoverContext => {
  const context = useContext<NullablePopoverContext>(PopoverContext);

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

function LegacyPopover({
  children,
  trigger,
  arrow = true,
  initialOpen = false,
  ...restOptions
}: LegacyPopoverProps) {
  const popover = usePopover({
    arrow,
    initialOpen,
    ...restOptions,
  });

  return (
    <PopoverContext.Provider value={popover}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent>
        {children}
        {popover.arrow && <PopoverArrow />}
      </PopoverContent>
    </PopoverContext.Provider>
  );
}

LegacyPopover.displayName = 'LegacyPopover';

export { LegacyPopover };

interface PopoverTriggerProps {
  children: React.ReactNode;
}

const PopoverTrigger = forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, ...props }, propRef) {
  const context = usePopoverContext();

  const child = isValidElement(children)
    ? (children as React.ReactElement & React.RefAttributes<HTMLElement>)
    : null;
  const ref = useMergeRefs([context.refs.setReference, propRef]);

  if (child) {
    const childProps = {
      ref,
      ...props,
      ...(child.props as Record<string, unknown>),
      ...context.getReferenceProps(),
      'data-state': context.open ? 'open' : 'closed',
      'aria-expanded': context.open,
    };

    return cloneElement(child, childProps);
  }

  return null;
});

const PopoverContent = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent(props, propRef) {
  const context = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  return context.open ? (
    <div
      ref={ref}
      style={{
        position: context.strategy,
        top: context.y ?? 0,
        left: context.x ?? 0,
      }}
      data-placement={context.placement}
      className={cl(
        classes.popover,
        classes[context.variant],
        context.className,
      )}
      {...context.getFloatingProps(props)}
      tabIndex={-1}
      role={context.role || 'dialog'}
    >
      {props.children}
    </div>
  ) : null;
});

const PopoverArrow = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent(props, propRef) {
  const context = usePopoverContext();
  const ref = useMergeRefs([context.arrowRef, propRef]);

  const arrowX = context.middlewareData.arrow?.x;
  const arrowY = context.middlewareData.arrow?.y;

  // Get the placement of the popover arrow independent of alignment, which is opposite of popover content placement.
  // Used to align the arrow to the edge of the content.
  const staticSide: string | undefined = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[context.placement.split('-')[0]];

  return (
    <div
      ref={ref}
      style={{
        ...(arrowX != null ? { left: arrowX } : {}),
        ...(arrowY != null ? { top: arrowY } : {}),
        ...(staticSide ? { [staticSide]: '-7px' } : {}),
      }}
      className={classes.arrow}
      {...props}
    />
  );
});
