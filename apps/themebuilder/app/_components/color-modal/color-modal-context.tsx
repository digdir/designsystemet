import type { Color } from '@digdir/designsystemet/internal';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ColorModal } from './color-modal';

type ColorModalContextType = {
  /** Opens the dialog with details about one step of a color. `namespace` is the name of the color. */
  openColorModal: (color: Color, namespace: string) => void;
};

const ColorModalContext = createContext<ColorModalContextType | undefined>(
  undefined,
);

/** Renders the one color dialog of the page, and lets everything inside open it */
export const ColorModalProvider = ({ children }: { children: ReactNode }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<{
    color: Color;
    namespace: string;
  } | null>(null);

  /* The dialog is rendered when a color is chosen, so it is opened after that render */
  useEffect(() => {
    if (selected && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [selected]);

  const context = useMemo(
    () => ({
      openColorModal: (color: Color, namespace: string) =>
        setSelected({ color, namespace }),
    }),
    [],
  );

  return (
    <ColorModalContext value={context}>
      {children}
      {selected && (
        <ColorModal
          // The dialog keeps the chosen color format in state, which starts over for another color
          key={`${selected.namespace} ${selected.color.name} ${selected.color.hex}`}
          colorModalRef={dialogRef}
          namespace={selected.namespace}
          color={selected.color}
        />
      )}
    </ColorModalContext>
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
