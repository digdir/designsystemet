import { createContext, useCallback, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

export type ModalContextProps = {
  setCloseModal: (fn: () => void) => void;
  closeModal?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type ModalRootProps = {
  children: ReactNode;
};

export const ModalContext = createContext<ModalContextProps>({
  setCloseModal: () => {},
  modalRef: { current: null },
  open: false,
  setOpen: () => {},
});

export const ModalRoot = ({ children }: ModalRootProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [closeModal, setCloseModal] = useState<(() => void) | undefined>();

  const setCloseModalInContext = useCallback((fn: () => void) => {
    setCloseModal(() => fn);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        setCloseModal: setCloseModalInContext,
        closeModal,
        modalRef,
        open,
        setOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

ModalRoot.displayName = 'ModalRoot';
