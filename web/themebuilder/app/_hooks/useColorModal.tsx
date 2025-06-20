import type { Color } from '@digdir/designsystemet';
import { ColorModal } from '@internal/components';
import { type JSX, useEffect, useRef, useState } from 'react';

type UseColorModalResult = {
  colorModalRef: React.RefObject<HTMLDialogElement | null>;
  ColorModalComponent: () => JSX.Element | null;
  openColorModal: (color: Color, namespace: string) => void;
};

export const useColorModal = (): UseColorModalResult => {
  const colorModalRef = useRef<HTMLDialogElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');

  /* This ensures the modal will be rendered before trying to show it */
  useEffect(() => {
    if (selectedColor && colorModalRef.current) {
      /* Small delay to ensure the DOM is updated */
      const timer = setTimeout(() => {
        if (colorModalRef.current) {
          colorModalRef.current.showModal();
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [selectedColor, selectedNamespace]);

  const openColorModal = (color: Color, namespace: string) => {
    setSelectedColor(color);
    setSelectedNamespace(namespace);
  };

  const ColorModalComponent = () => {
    if (!selectedColor) return null;

    return (
      <ColorModal
        colorModalRef={colorModalRef}
        namespace={selectedNamespace}
        color={selectedColor}
      />
    );
  };

  return {
    colorModalRef,
    ColorModalComponent,
    openColorModal,
  };
};
