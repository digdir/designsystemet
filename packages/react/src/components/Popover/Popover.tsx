import type { HTMLAttributes } from 'react';
import React, {
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
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react';
import cn from 'classnames';

import classes from './Popover.module.css';

export enum PopoverVariant {
  Default = 'default',
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
}

interface IPopoverOptions extends HTMLAttributes<HTMLDivElement> {
  variant?: PopoverVariant;
  arrow?: boolean;
  offset?: number;
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface IPopoverRequiredProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export type PopoverProps = IPopoverOptions & IPopoverRequiredProps;

export function usePopover({
  variant = PopoverVariant.Default,
  arrow = true,
  initialOpen = false,
  placement,
  modal = true,
  offset: offset,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  ...restOptions
}: IPopoverOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const arrowRef = useRef<HTMLDivElement | null>(null);

  const data = useFloating({
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

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      ...restOptions,
      modal,
      arrow,
      arrowRef,
      variant,
    }),
    [
      open,
      setOpen,
      interactions,
      data,
      restOptions,
      modal,
      arrow,
      arrowRef,
      variant,
    ],
  );
}

type ContextType = ReturnType<typeof usePopover> | null;

const PopoverContext = createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

export function Popover({
  children,
  trigger,
  modal = false,
  ...restOptions
}: PopoverProps) {
  const popover = usePopover({ modal, ...restOptions });

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

interface PopoverTriggerProps {
  children: React.ReactNode;
}

const PopoverTrigger = forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.reference, propRef, childrenRef]);

  if (isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
        'aria-expanded': context.open,
      }),
    );
  }

  return null;
});

const PopoverContent = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent(props, propRef) {
  const context = usePopoverContext();
  const ref = useMergeRefs([context.floating, propRef]);

  return (
    <FloatingPortal>
      {context.open && (
        <FloatingFocusManager
          context={context.context}
          modal={context.modal}
          visuallyHiddenDismiss={true}
        >
          <div
            ref={ref}
            style={{
              position: context.strategy,
              top: context.y ?? 0,
              left: context.x ?? 0,
              width: 'max-content',
            }}
            data-placement={context.placement}
            className={cn(
              classes.popover,
              classes[context.variant],
              context.className,
            )}
            {...context.getFloatingProps(props)}
            data-testid={'popover-content-test-id'}
          >
            {props.children}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});

const PopoverArrow = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent(props, propRef) {
  const context = usePopoverContext();
  const ref = useMergeRefs([context.arrowRef, propRef]);

  const arrowX = context.middlewareData.arrow?.x;
  const arrowY = context.middlewareData.arrow?.y;

  const staticSide = {
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
    ></div>
  );
});
