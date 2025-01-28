import { createContext, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';

export const Context = createContext<RefObject<HTMLDialogElement | null>>({
  current: null,
});

export type ModalTriggerContextProps = { children: ReactNode };

/**
 * ModalTriggerContext component, used to provide a context for a modal trigger.
 *
 * @example
 * <Modal.TriggerContext>
 *   <Modal.Trigger>Open Modal</Modal.Trigger>
 *   <Modal>
 *     Content
 *   </Modal>
 * </Modal.TriggerContext>
 */
export const ModalTriggerContext = ({ children }: ModalTriggerContextProps) => {
  const contextRef = useRef<HTMLDialogElement>(null);

  return <Context.Provider value={contextRef}>{children}</Context.Provider>;
};

ModalTriggerContext.displayName = 'ModalTriggerContext';
