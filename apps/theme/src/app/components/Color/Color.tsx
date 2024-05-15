import classes from "./Color.module.css";
import cn from "classnames";
import { SunIcon } from "@navikt/aksel-icons";
import { Tooltip } from "@digdir/designsystemet-react";
import { useState } from "react";

type ColorProps = {
  color: string;
  contrast?: string;
  lightness?: string;
  featured?: boolean;

  hex?: string;
  showColorMeta?: boolean;
};

const Color = ({
  color,
  contrast,
  featured,
  lightness,
  hex,
  showColorMeta = true,
}: ColorProps) => {
  const [tooltipText, setTooltipText] = useState("Kopier hexverdi " + hex);
  return (
    <div>
      <Tooltip content={tooltipText} placement="top">
        <div
          onClick={() => {
            navigator.clipboard.writeText(hex as string);
            setTooltipText("Kopiert!");
          }}
          onMouseLeave={() => {
            setTooltipText("Kopier hexverdi");
          }}
          onMouseEnter={() => {
            setTooltipText(hex);
          }}
          style={{ backgroundColor: color }}
          className={cn(classes.box, { [classes.featured]: featured })}
        ></div>
      </Tooltip>

      {showColorMeta && (
        <>
          <div className={classes.hex}>{hex}</div>
          <div className={classes.contrast}>
            <div className={classes.colorTest}></div>
            {contrast}
          </div>
          <div className={classes.lightness}>
            <SunIcon title="a11y-title" fontSize="1.3rem" />
            {lightness}
          </div>
        </>
      )}
    </div>
  );
};

export { Color };
