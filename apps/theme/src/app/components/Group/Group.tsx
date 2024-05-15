import classes from "./Group.module.css";
import { Color } from "../Color/Color";
import { CssColor } from "@adobe/leonardo-contrast-colors";
import cn from "classnames";

type ColorType = {
  color: CssColor;
  contrast: string;
  lightness: string;
};

type GroupProps = {
  header: string;
  colors: ColorType[];
  showColorMeta?: boolean;
  names?: string[];
  featured?: boolean;
};

export const Group = ({
  header,
  colors,
  showColorMeta,
  names,
  featured = false,
}: GroupProps) => {
  return (
    <div className={classes.group}>
      {header && (
        <div className={cn(classes.header, { [classes.featured]: featured })}>
          {header}
        </div>
      )}
      {header && names && (
        <div className={classes.names}>
          {names.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      )}
      <div
        className={cn(classes.colors, { [classes.colorsFeatured]: featured })}
      >
        {colors.map(function (item, index) {
          return (
            <Color
              key={index}
              color={item.color}
              contrast={item.contrast}
              lightness={item.lightness}
              hex={item.color}
              showColorMeta={showColorMeta}
            />
          );
        })}
      </div>
    </div>
  );
};
