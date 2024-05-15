import { useEffect, useRef, useState } from "react";
import classes from "./ColorPicker.module.css";
import { ChromePicker } from "react-color";
import { CssColor } from "@adobe/leonardo-contrast-colors";
import cn from "classnames";
import { useClickOutside } from "@react-awesome/use-click-outside";

type ColorPickerProps = {
  label: string;
  onColorChanged?: any;
  defaultColor: CssColor;
  disabled?: boolean;
};

export const ColorPicker = ({
  label,
  onColorChanged,
  defaultColor,
  disabled,
}: ColorPickerProps) => {
  const [color, setColor] = useState<CssColor>("#0062BA");
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

  const onInputChanged = (e: any) => {
    let target = e.target.value;
    if (target.length >= 7) {
      setColor(target);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(classes.whole, { [classes.disabled]: disabled })}
    >
      <div className={classes.picker}>
        <div className={classes.label}>{label}</div>
        <div className={classes.container} onClick={() => handleClick()}>
          <div
            style={{ backgroundColor: color }}
            className={classes.color}
          ></div>
          <div className={classes.input}>{color}</div>
        </div>
      </div>
      <div className={cn(classes.popup, { [classes.show]: showModal })}>
        <ChromePicker
          onChange={(e) => {
            setColor(e.hex);
            onColorChanged(e.hex);
          }}
          color={color}
          width={250}
        />
      </div>
    </div>
  );
};
