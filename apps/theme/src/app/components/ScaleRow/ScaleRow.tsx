import classes from "./ScaleRow.module.css";
import cn from "classnames";
import { Scale } from "../Scale/Scale";
import { CssColor } from "@adobe/leonardo-contrast-colors";
import { useEffect, useRef, useState } from "react";
import { getRatioFromLum, luminanceFromHex } from "@/utils/ColorUtils";
import { CheckmarkIcon, XMarkIcon } from "@navikt/aksel-icons";
import { ChromePicker } from "react-color";
import { modeType } from "@/types";
import { useClickOutside } from "@react-awesome/use-click-outside";

type ScaleRowProps = {
  color: CssColor;
  showHeader?: boolean;
  name: string;
  themeMode: modeType;
};

export const ScaleRow = ({
  color,
  showHeader,
  name,
  themeMode,
}: ScaleRowProps) => {
  const [contrast, setContrast] = useState<number>(0);
  const [activeColor, setActiveColor] = useState<CssColor>("#000000");
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let lum1 = luminanceFromHex(color);
    let lum2 = luminanceFromHex("#ffffff");
    let ratio = getRatioFromLum(lum1, lum2);
    setContrast(ratio);
    setActiveColor(color);
  }, [color]);

  useClickOutside(ref.current, () => {
    setShowPicker(false);
  });

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div className={classes.row}>
      <div className={classes.selectedColor}>
        <div className={classes.name}>{name}</div>
        <div ref={ref} className={classes.tomato}>
          <div className={classes.tt} onClick={() => handleClick()}>
            <div
              className={classes.previewColor}
              style={{ backgroundColor: activeColor }}
            ></div>
            <div className={classes.picker}>
              <div>Velg farge</div>
            </div>
          </div>
          <div
            className={cn(classes.pickerTool, {
              [classes.showPickerTool]: showPicker,
            })}
          >
            <ChromePicker
              onChange={(e) => {
                let lum1 = luminanceFromHex(e.hex);
                let lum2 = luminanceFromHex("#ffffff");
                let ratio = getRatioFromLum(lum1, lum2);
                setContrast(ratio);
                setActiveColor(e.hex);
              }}
              color={activeColor}
              width={250}
            />
          </div>
        </div>
        <div>{activeColor}</div>
        <div className={classes.contrast}>
          Contrast: {contrast.toFixed(2)}
          <div
            className={cn(classes.icon, {
              [classes.red]: contrast < 4.5,
            })}
          >
            {contrast > 4.5 && (
              <CheckmarkIcon title="a11y-title" fontSize="1.3rem" />
            )}
            {contrast < 4.5 && (
              <XMarkIcon title="a11y-title" fontSize="1.3rem" />
            )}
          </div>
        </div>
      </div>
      <Scale
        color={activeColor}
        showHeader={showHeader}
        themeMode={themeMode}
      />
      <div></div>
    </div>
  );
};
