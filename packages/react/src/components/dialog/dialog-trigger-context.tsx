import type { ReactNode } from 'react';
import { createContext, useRef } from 'react';

export const Context = createContext<React.RefObject<HTMLDialogElement | null>>(
  {
    current: null,
  },
);

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
export const DialogTriggerContext = (rest: DialogTriggerContextProps) => {
  const contextRef = useRef<HTMLDialogElement>(null);

  return <Context.Provider value={contextRef} {...rest} />;
};

DialogTriggerContext.displayName = 'DialogTriggerContext';
