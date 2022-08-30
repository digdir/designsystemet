import customTheme from "./customTheme.js";
import { DocsContainer } from "@storybook/addon-docs";
import tokens from "../node_modules/@digdir/ds-tokens/build/tokens.js";
// Import assets available to all stories
import "bootstrap/scss/bootstrap-grid.scss";
import "./customStyling.scss";
import React from "react";

export const parameters = {
  layout: "centered",
  viewMode: "docs",
  docs: {
    theme: customTheme,
    container: ({ children, ...rest }) => (
      <React.Fragment>
        <DocsContainer {...rest}>{children}</DocsContainer>
      </React.Fragment>
    ),
  },
  backgrounds: {
    values: [
      {
        name: "grey-100",
        value: tokens.color.neutral.grey["100"],
      },
      {
        name: "grey-200",
        value: tokens.color.neutral.grey["200"],
      },
    ],
  },
  options: {
    storySort: {
      order: [
        "Introduksjon",
        "Design Tokens",
        "Logos",
        ["Introduksjon"],
        "Core components",
        ["Introduksjon"],
        "Web components",
        ["Introduksjon"],
        "Admin",
        "Changelog",
        ["Design Tokens", "Core components", "Web components"],
      ],
    },
  },
  actions: {
    disabled: true,
  },
};
