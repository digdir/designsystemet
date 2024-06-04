"use client";

import { useEffect, useState } from "react";
import type { CssColor } from "@adobe/leonardo-contrast-colors";
import cn from "classnames";

import { getContrastFromHex } from "../../utils/ColorUtils";
import { generateColorScale } from "../../utils/themeUtils";

import classes from "./page.module.css";

const ContrastSection = (mainColor: CssColor, bgColor: CssColor) => {
  const contrast = getContrastFromHex(mainColor, bgColor);
  return (
    <div className={classes.contrast}>
      {contrast > 4.5 && <div className={cn(classes.dot, classes.green)}></div>}
      {contrast < 4.5 && contrast > 3 && (
        <div className={cn(classes.dot, classes.orange)}></div>
      )}
      {contrast < 3 && <div className={cn(classes.dot, classes.red)}></div>}
      <div>{contrast.toFixed(1)}:1</div>
    </div>
  );
};

const Box = (name: string, color1: CssColor, color2: CssColor) => {
  return (
    <div className={classes.box}>
      <div className={classes.color} style={{ backgroundColor: color1 }} />
      <div className={classes.test}>
        <div className={classes.name}>{name}</div>
        <div>{ContrastSection(color1, color2)}</div>
      </div>
    </div>
  );
};

const BaseRow = (color: CssColor) => {
  const lightColors: CssColor[] = generateColorScale(
    color,
    "light",
    "flat"
  ) as CssColor[];
  // Unused currently
  /* const darkColors: CssColor[] = generateColorScale(
    color,
    "dark",
    "flat"
  ) as CssColor[]; */
  return (
    <>
      <h2 className={classes.mainTitle}>Base color</h2>
      <div className={classes.row}>
        <div
          className={cn(classes.column, classes.whiteText)}
          style={{ backgroundColor: lightColors[8] }}
        >
          <h2 className={classes.title}>Base default: Light</h2>
          {Box("Text default", lightColors[13], lightColors[9])}
          {Box("Text subtle", lightColors[14], lightColors[9])}
        </div>
        <div
          className={cn(classes.column, classes.whiteText)}
          style={{ backgroundColor: lightColors[8] }}
        >
          <h2 className={classes.title}>Base default: Light</h2>
          {Box("Text default", lightColors[13], lightColors[9])}
          {Box("Text subtle", lightColors[14], lightColors[9])}
        </div>
        <div
          className={cn(classes.column, classes.whiteText)}
          style={{ backgroundColor: lightColors[9] }}
        >
          <h2 className={classes.title}>Surface active</h2>
          {Box("Text default", lightColors[13], lightColors[10])}
          {Box("Text subtle", lightColors[14], lightColors[10])}
        </div>
        <div
          className={cn(classes.column, classes.whiteText)}
          style={{ backgroundColor: lightColors[10] }}
        >
          <h2 className={classes.title}>Surface active</h2>
          {Box("Text default", lightColors[13], lightColors[11])}
          {Box("Text subtle", lightColors[14], lightColors[11])}
        </div>
      </div>
    </>
  );
};

const Row = (title: string, colors: CssColor[], whiteText: boolean = false) => {
  return (
    <div className={cn({ [classes.whiteText]: whiteText })}>
      <h2 className={classes.mainTitle}>{title}</h2>
      <div className={classes.row}>
        <div className={classes.column} style={{ backgroundColor: colors[0] }}>
          <h2 className={classes.title}>Background default</h2>
          {Box("Border subtle", colors[5], colors[0])}
          {Box("Border default", colors[6], colors[0])}
          {Box("Border strong", colors[7], colors[0])}
          {Box("Text subtle", colors[11], colors[0])}
          {Box("Text default", colors[12], colors[0])}
        </div>
        <div className={classes.column} style={{ backgroundColor: colors[1] }}>
          <h2 className={classes.title}>Background subtle</h2>
          {Box("Border subtle", colors[5], colors[1])}
          {Box("Border default", colors[6], colors[1])}
          {Box("Border strong", colors[7], colors[1])}
          {Box("Text subtle", colors[11], colors[1])}
          {Box("Text default", colors[12], colors[1])}
        </div>
        <div className={classes.column} style={{ backgroundColor: colors[2] }}>
          <h2 className={classes.title}>Surface default</h2>
          {Box("Border subtle", colors[5], colors[2])}
          {Box("Border default", colors[6], colors[2])}
          {Box("Border strong", colors[7], colors[2])}
          {Box("Text subtle", colors[11], colors[2])}
          {Box("Text default", colors[12], colors[2])}
        </div>
        <div className={classes.column} style={{ backgroundColor: colors[3] }}>
          <h2 className={classes.title}>Surface hover</h2>
          {Box("Border subtle", colors[5], colors[3])}
          {Box("Border default", colors[6], colors[3])}
          {Box("Border strong", colors[7], colors[3])}
          {Box("Text subtle", colors[11], colors[3])}
          {Box("Text default", colors[12], colors[3])}
        </div>
        <div className={classes.column} style={{ backgroundColor: colors[4] }}>
          <h2 className={classes.title}>Surface active</h2>
          {Box("Border subtle", colors[5], colors[4])}
          {Box("Border default", colors[6], colors[4])}
          {Box("Border strong", colors[7], colors[4])}
          {Box("Text subtle", colors[11], colors[4])}
          {Box("Text default", colors[12], colors[4])}
        </div>
      </div>
    </div>
  );
};

export default function Dev() {
  const [lightColors, setLightColors] = useState<CssColor[]>([
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
  ]);
  const [darkColors, setDarkColors] = useState<CssColor[]>([
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
  ]);
  const [contrastColors, setContrastColors] = useState<CssColor[]>([
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
  ]);
  useEffect(() => {
    const lightScale = generateColorScale("#0062BA", "light", "flat") as CssColor[];
    const darkScale = generateColorScale("#0062BA", "dark", "flat") as CssColor[];
    const contrastScale = generateColorScale("#0062BA", "contrast", "flat") as CssColor[];
    setLightColors(lightScale);
    setDarkColors(darkScale);
    setContrastColors(contrastScale);
  }, []);
  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <h1 className={classes.pageTitle}>Contrast chart</h1>
        {Row("Light mode", lightColors)}
        {Row("Dark mode", darkColors, true)}
        {Row("Contrast mode", contrastColors, true)}
        {BaseRow("#300404")}
      </div>
    </div>
  );
}
