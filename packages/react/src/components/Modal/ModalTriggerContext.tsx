import { createContext, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';

export const Context = createContext<RefObject<HTMLDialogElement>>({
  current: null,
});

export type ModalTriggerContextProps = { children: ReactNode };

export const ModalTriggerContext = ({ children }: ModalTriggerContextProps) => {
  const contextRef = useRef<HTMLDialogElement>(null);

  return <Context.Provider value={contextRef}>{children}</Context.Provider>;
};

ModalTriggerContext.displayName = 'ModalTriggerContext';
