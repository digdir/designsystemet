import { createContext, useCallback, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

export type ContextProps = {
  closeModal?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
  open: boolean;
  setCloseModal: (fn: () => void) => void;
  setOpen: (open: boolean) => void;
};

export type ModalContextProps = { children: ReactNode };

export const Context = createContext<ContextProps>({
  modalRef: { current: null },
  open: false,
  setCloseModal: () => {},
  setOpen: () => {},
});

export const ModalContext = ({ children }: ModalContextProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [closeModal, setCloseModal] = useState<(() => void) | undefined>();

  const setCloseModalInContext = useCallback((fn: () => void) => {
    setCloseModal(() => fn);
  }, []);

  return (
    <Context.Provider
      value={{
        closeModal,
        modalRef,
        open,
        setCloseModal: setCloseModalInContext,
        setOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
};

ModalContext.displayName = 'ModalContext';
