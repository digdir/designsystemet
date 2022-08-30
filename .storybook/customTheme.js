import { create } from "@storybook/theming";
import logo from "./assets/logo_digdir.svg";
import tokens from "../node_modules/@digdir/ds-tokens/build/tokens.js";

export default create({
  brandTitle: "DigDir design system",
  brandUrl: "https://profilveileder.digdir.no/",
  brandImage: logo,
  fontBase: '"Inter", sans-serif',
  // Colors
  base: "light",
  colorSecondary: "#1062D5",
  barTextColor: tokens.color.neutral.grey["600"],
  appBg: tokens.color.neutral.grey["100"],
  textColor: tokens.color.text.background.light,
});
