import type { SetStateAction} from "react";
import { useEffect, useState } from "react";
import type { CssColor } from "@adobe/leonardo-contrast-colors";

import { generateColorScale } from "@/utils/themeUtils";
import type { modeType, colorsType } from "@/types";

import { Group } from "../Group/Group";

import classes from "./Scale.module.css";

type ScaleProps = {
  color: CssColor;
  showHeader?: boolean;
  showColorMeta?: boolean;
  themeMode: modeType;
  type: "accent" | "grey" | "brandOne" | "brandTwo" | "brandThree";
};

const setTokens = (lightColors: any, type: string) => {
  const previewElement = document.getElementById("preview");
  if (previewElement) {
    for (let i = 0; i < lightColors.length; i++) {
      previewElement.style.setProperty("--" + type + (i + 1), lightColors[i]);
    }
  }
};

export const Scale = ({
  color,
  showHeader,
  showColorMeta,
  themeMode,
  type,
}: ScaleProps) => {
  // Is there a way to not have to set this default value?
  const [colors, setColors] = useState<colorsType>({
    background: {
      subtle: { color: "#ffffff", contrast: "", lightness: "" },
      default: { color: "#ffffff", contrast: "", lightness: "" },
    },
    component: {
      normal: { color: "#ffffff", contrast: "", lightness: "" },
      hover: { color: "#ffffff", contrast: "", lightness: "" },
      active: { color: "#ffffff", contrast: "", lightness: "" },
    },
    border: {
      subtle: { color: "#ffffff", contrast: "", lightness: "" },
      default: { color: "#ffffff", contrast: "", lightness: "" },
      strong: { color: "#ffffff", contrast: "", lightness: "" },
    },
    solid: {
      normal: { color: "#ffffff", contrast: "", lightness: "" },
      hover: { color: "#ffffff", contrast: "", lightness: "" },
      active: { color: "#ffffff", contrast: "", lightness: "" },
      contrastOne: { color: "#ffffff", contrast: "", lightness: "" },
      contrastTwo: { color: "#ffffff", contrast: "", lightness: "" },
    },
    text: {
      subtle: { color: "#ffffff", contrast: "", lightness: "" },
      default: { color: "#ffffff", contrast: "", lightness: "" },
    },
  });

  useEffect(() => {
    const lightColors = generateColorScale(color, themeMode);
    const colorsFlat = generateColorScale(color, themeMode, "flat");

    setColors(lightColors as SetStateAction<colorsType>);
    setTokens(colorsFlat, type);
  }, [color, themeMode, type]);
  return (
    <div className={classes.themes}>
      <div className={classes.test}>
        <Group
          header={showHeader ? "Background" : ""}
          colors={[colors?.background.subtle, colors?.background.default]}
          showColorMeta={showColorMeta}
          names={["1. Default", "2. Subtle"]}
        />
        <Group
          header={showHeader ? "Surface" : ""}
          colors={[
            colors?.component.normal,
            colors?.component.hover,
            colors?.component.active,
          ]}
          showColorMeta={showColorMeta}
          names={["3. Default", "4. Hover", "5. Active"]}
        />
        <Group
          showColorMeta={showColorMeta}
          header={showHeader ? "Border" : ""}
          colors={[
            colors?.border.subtle,
            colors?.border.default,
            colors?.border.strong,
          ]}
          names={["6. Subtle", "7. Default", "8. Strong"]}
        />
        <Group
          showColorMeta={showColorMeta}
          header={showHeader ? "Base" : ""}
          colors={[
            colors?.solid.normal,
            colors?.solid.hover,
            colors?.solid.active,
          ]}
          names={["9. Default", "10. Hover", "11. Active"]}
          featured
        />
        <Group
          showColorMeta={showColorMeta}
          header={showHeader ? "Text" : ""}
          colors={[colors?.text.subtle, colors?.text.default]}
          names={["12. Subtle", "13. Default"]}
        />
      </div>
    </div>
  );
};
