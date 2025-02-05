import { createContext, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';

export const Context = createContext<RefObject<HTMLDialogElement | null>>({
  current: null,
});

export type DialogTriggerContextProps = { children: ReactNode };

/**
 * DialogTriggerContext component, used to provide a context for a dialog trigger.
 *
 * @example
 * <Dialog.TriggerContext>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog>
 *     Content
 *   </Dialog>
 * </Dialog.TriggerContext>
 */
export const DialogTriggerContext = ({
  children,
}: DialogTriggerContextProps) => {
  const contextRef = useRef<HTMLDialogElement>(null);

  return <Context.Provider value={contextRef}>{children}</Context.Provider>;
};

DialogTriggerContext.displayName = 'DialogTriggerContext';
