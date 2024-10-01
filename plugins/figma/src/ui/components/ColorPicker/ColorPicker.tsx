import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { useClickOutside } from '@react-awesome/use-click-outside';
import cl from 'clsx';
import { useRef, useState } from 'react';
import { ChromePicker } from 'react-color';

import classes from './ColorPicker.module.css';

type ColorPickerProps = {
  title: string;
  color: CssColor;
  onColorChanged?: ((color: CssColor) => void) | undefined;
};

export const ColorPicker = ({
  title,
  color,
  onColorChanged,
}: ColorPickerProps) => {
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    setShowModal(!showModal);
  };
  const ref = useRef(null);

  useClickOutside(ref.current, () => {
    setShowModal(false);
  });

  return (
    <div className={classes.container} ref={ref}>
      <button className={classes.picker} onClick={() => handleClick()}>
        <div
          className={classes.circle}
          style={{ backgroundColor: color }}
        ></div>
        <div className={classes.text}>
          <span className={classes.name}>{title}</span>
          <span className={classes.hex}>{color}</span>
        </div>
      </button>

      <div className={cl(classes.popup, showModal && classes.show)}>
        <ChromePicker
          onChangeComplete={({ hex }: { hex: string }) => {
            onColorChanged?.(hex as CssColor);
          }}
          color={color}
        />
      </div>
    </div>
  );
};
