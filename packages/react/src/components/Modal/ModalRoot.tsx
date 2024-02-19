import { createContext, useRef, useState } from 'react';

export type ModalContextProps = {
  closeModal?: () => void;
  modalRef: React.RefObject<HTMLDialogElement>;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type ModalRootProps = {
  children: React.ReactNode;
};

export const ModalContext = createContext<ModalContextProps>({
  modalRef: { current: null },
  open: false,
  setOpen: () => {},
});

export const ModalRoot = ({ children }: ModalRootProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        closeModal: () => {},
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
