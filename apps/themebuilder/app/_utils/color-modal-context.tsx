import type {
  Color,
  SemanticColorNames,
} from '@digdir/designsystemet/internal';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ColorModal } from '~/_components/color-modal/color-modal';

type ColorModalContextType = {
  openColorModal: (color: Color, namespace: string) => void;
};

/**
 * Only the step identity is stored, so the modal can look up fresh color data
 * from the loader on every render (e.g. after an override is set or reset).
 */
type SelectedStep = {
  namespace: string;
  tokenName: SemanticColorNames;
};

const ColorModalContext = createContext<ColorModalContextType | undefined>(
  undefined,
);

export const ColorModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorModalRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<SelectedStep | null>(null);

  /* Open once the modal for the selected step has been rendered */
  useEffect(() => {
    if (selected) colorModalRef.current?.showModal();
  }, [selected]);

  const openColorModal = useCallback((color: Color, namespace: string) => {
    setSelected({ namespace, tokenName: color.name });
  }, []);

  const value = useMemo(() => ({ openColorModal }), [openColorModal]);

  return (
    <ColorModalContext.Provider value={value}>
      {children}
      {selected && (
        <ColorModal
          colorModalRef={colorModalRef}
          namespace={selected.namespace}
          tokenName={selected.tokenName}
        />
      )}
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
