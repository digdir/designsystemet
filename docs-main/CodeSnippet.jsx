import React, { useState } from "react";
import "./CodeSnippet.scss";
// Syntax highlighting
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import scss from "react-syntax-highlighter/dist/esm/languages/prism/scss";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
// Import more language support here as needed e.g.:
// import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
SyntaxHighlighter.registerLanguage("markup", markup);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("javascript", javascript);
// Formatting
import prettier from "prettier/standalone.js";
import parserJs from "prettier/parser-flow.js";
import parserHtml from "prettier/parser-html.js";
import parserCss from "prettier/parser-postcss.js";
// Tooltip
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

/**
 * Code snippet block with syntax highlighting
 *
 * @property {string} children - string of code to be included in code snippet
 * @property {string} language - options: markup | css | scss | javascript
 */
const CodeSnippet = ({ children = "", language = "markup" }) => {
  const [tooltipText, setTooltipText] = useState("Kopier til utklippstavle");

  const handleHoverOff = () => {
    setTimeout(() => setTooltipText("Kopier til utklippstavle"), 200);
  };
  const handleClick = () => {
    navigator.clipboard.writeText(children);
    setTooltipText("Kopiert!");
  };

  if (language === "css" || language === "scss") {
    children = prettier.format(children, {
      parser: "css",
      plugins: [parserCss],
    });
  }
  if (language === "markup") {
    children = prettier.format(children, {
      parser: "html",
      plugins: [parserHtml],
    });
  }
  if (language === "javascript") {
    children = prettier.format(children, {
      parser: "flow",
      plugins: [parserJs],
    });
  }

  return (
    <Tippy placement="top-end" content={tooltipText} hideOnClick={false}>
      <button
        onClick={handleClick}
        onMouseLeave={handleHoverOff}
        className="ddsdocs-cdn-snippet"
      >
        <SyntaxHighlighter
          language={language}
          style={prism}
          customStyle={{
            fontSize: "14px",
            margin: 0,
          }}
        >
          {children}
        </SyntaxHighlighter>
      </button>
    </Tippy>
  );
};

export { CodeSnippet };
