import customTheme from "./customTheme.js";
// Import assets available to all stories
import "./inter.scss"
import "./customStyling.scss";
import React from "react";

export const parameters = {
  layout: "centered",
  viewMode: "docs",
  docs: {
    theme: customTheme
  },
  backgrounds: {
    values: [
      {
        name: "grey-100",
        value: "#f4f5f6",
      },
      {
        name: "grey-200",
        value: "#e9eaec",
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
        ["Introduksjon", "Button"],
        "Changelog",
        ["Design Tokens", "Core components"],
      ],
    },
  },
  actions: {
    disabled: true,
  },
};
