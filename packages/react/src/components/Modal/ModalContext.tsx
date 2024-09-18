import { createContext, useCallback, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

export const Context = createContext<RefObject<HTMLDialogElement>>({
  current: null,
});

export type ModalContextProps = { children: ReactNode };

export const ModalContext = ({ children }: ModalContextProps) => {
  const contextRef = useRef<HTMLDialogElement>(null);

  return <Context.Provider value={contextRef}>{children}</Context.Provider>;
};

ModalContext.displayName = 'ModalContext';
