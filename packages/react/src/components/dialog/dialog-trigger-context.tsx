import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

type DialogContext = { id?: string; modal?: boolean };
export const Context = createContext<
  DialogContext & { setContext?: (context: DialogContext) => void }
>({});

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
  const [state, setState] = useState<DialogContext>({});
  const setContext = (next: DialogContext) => setState({ ...state, ...next });

  return <Context.Provider value={{ ...state, setContext }} {...rest} />;
};

DialogTriggerContext.displayName = 'DialogTriggerContext';
