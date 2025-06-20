import type { Color } from '@digdir/designsystemet';
import { createContext, useContext } from 'react';
import { useColorModal } from '~/_hooks/useColorModal';

type ColorModalContextType = {
  openColorModal: (color: Color, namespace: string) => void;
};

const ColorModalContext = createContext<ColorModalContextType | undefined>(
  undefined,
);

export const ColorModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { ColorModalComponent, openColorModal } = useColorModal();

  return (
    <ColorModalContext.Provider value={{ openColorModal }}>
      {children}
      <ColorModalComponent />
    </ColorModalContext.Provider>
  );
};

export const useColorModalContext = (): ColorModalContextType => {
  const context = useContext(ColorModalContext);

  if (context === undefined) {
    throw new Error(
      'useColorModalContext must be used within a ColorModalProvider',
    );
  }

  return context;
};
