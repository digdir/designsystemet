import { createContext, useRef } from 'react';

export type ModalContextProps = {
  closeModal?: () => void;
  modalRef: React.RefObject<HTMLDialogElement>;
};

export type ModalRootProps = {
  children: React.ReactNode;
};

export const ModalContext = createContext<ModalContextProps>({
  modalRef: { current: null },
});

export const ModalRoot = ({ children }: ModalRootProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <ModalContext.Provider
      value={{
        closeModal: () => {},
        modalRef,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

ModalRoot.displayName = 'Modal.Root';
