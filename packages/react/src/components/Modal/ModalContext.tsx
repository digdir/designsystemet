import { createContext } from 'react';

export type ModalContextProps = {
  closeModal?: () => void;
};

export const ModalContext = createContext<ModalContextProps | null>(null);
