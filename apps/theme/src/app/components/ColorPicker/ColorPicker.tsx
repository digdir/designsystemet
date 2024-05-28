import { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import type { CssColor } from "@adobe/leonardo-contrast-colors";
import cn from "classnames";
import { useClickOutside } from "@react-awesome/use-click-outside";

import classes from "./ColorPicker.module.css";

type ColorPickerProps = {
  label: string;
  onColorChanged?: ((color: string) => void) | undefined;
  defaultColor: CssColor;
  disabled?: boolean;
};

export const ColorPicker = ({
  label,
  onColorChanged,
  defaultColor,
  disabled,
}: ColorPickerProps) => {
  const [color, setColor] = useState<string>("#0062BA");
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    setShowModal(!showModal);
  };
  const ref = useRef(null);

  useClickOutside(ref.current, () => {
    setShowModal(false);
  });

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  return (
    <div
      ref={ref}
      className={cn(classes.whole, { [classes.disabled]: disabled })}
    >
      <div className={classes.picker}>
        <div className={classes.label}>{label}</div>
        <button className={classes.container} onClick={() => handleClick()}>
          <div
            style={{ backgroundColor: color }}
            className={classes.color}
          ></div>
          <div className={classes.input}>{color}</div>
        </button>
      </div>
      <div className={cn(classes.popup, { [classes.show]: showModal })}>
        <ChromePicker
          onChange={({ hex }: { hex: string }) => {
            setColor(hex);
            onColorChanged && onColorChanged(hex);
          }}
          color={color}
        />
      </div>
    </div>
  );
};
