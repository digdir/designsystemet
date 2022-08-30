import React from "react";
import "./TokenTable.scss";
import tokens from "@digdir/ds-tokens/build/tokens.js";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

/**
 * Flatten object structure
 *
 * Example input:
 * {
 *   "spacing": {
 *     "one": "0.5rem",
 *     "base": {
 *       "one": "0.25rem",
 *     }
 *   }
 * }
 *
 * Example output:
 * {
 *  'spacing-one': '0.5rem',
 *  'spacing-base-one': '0.25rem'
 * }
 *
 *  @param {Object} jsonObject
 *  @param {string} prefix
 *  @param {Object} name
 *
 */
const flattenObject = (jsonObject = {}, prefix = "", result = {}) => {
  for (const key in jsonObject) {
    if (typeof jsonObject[key] !== "object") {
      result[prefix + key] = jsonObject[key];
    } else {
      flattenObject(jsonObject[key], `${prefix}${key}-`, result);
    }
  }
  return result;
};

/**
 * Token preview cell block
 *
 * @property {string} category - token category (used in CSS class name)
 */
const PreviewCell = ({ category, ...props }) => {
  const classnamePrefix = "ddsdocs-table__preview";
  return (
    <div className={`${classnamePrefix}-${category}`} {...props}>
      {props.children}
    </div>
  );
};

/**
 * Table row displaying spacing design token ( |-name-|-value-|-preview-| ).
 *
 * @property {string} name
 * @property {string} value
 * @property {React.ReactNode} children - element to be displayed as preview of token
 * @property {boolean} preview - display preview of token
 */
const TokenRow = ({ name, value, children, preview = true }) => {
  const scssVariable = `$${name}`;
  let displayedValue = value;

  // Display pixel value
  if (value.length > 3 && value.substr(value.length - 3) === "rem") {
    const pixelValue = parseFloat(value) * 16;
    displayedValue = `${value} (${pixelValue}px)`;
  }

  return (
    <tr className="ddsdocs-table__row">
      <td className="ddsdocs-table__data-cell">
        <Tippy placement="right" content="Kopier til utklippstavle">
          <button
            type="button"
            className="dds-button dds-button--secondary dds-button--small dds-button--icon-right"
            onClick={() => navigator.clipboard.writeText(scssVariable)}
          >
            {scssVariable}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          </button>
        </Tippy>
      </td>
      <td className="ddsdocs-table__data-cell">
        <code>{displayedValue}</code>
      </td>
      {preview && <td className="ddsdocs-table__data-cell">{children}</td>}
    </tr>
  );
};

/**
 * Table displaying design tokens ( |-name-|-value-|-preview-| or |-name-|-value-| ).
 *
 * @property {string} category - spacing | color | font-size | font-weight | font-line-height | font-family | border-width
 * @property {boolean} preview - display preview of token
 */
const TokenTable = ({ category = "", preview = true }) => {
  let tokenSubset = tokens[category];
  let tokenMap = {};
  // Preview cell sample text
  const textDuration = "Hold over for forhåndsvisning";
  const textLongLorem =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam veniam eumdicta.";
  const textShortLorem = "Lorem ipsum";

  // Resolve kebab-case categories
  if (category.startsWith("font") || category.startsWith("border")) {
    const subcategories = category.split("-");
    tokenSubset = tokens[subcategories[0]][subcategories[1]];
  }

  // Resolve edge case where category has one value
  if (typeof tokenSubset !== "object") {
    tokenMap = { [category]: tokenSubset };
  } else {
    tokenMap = flattenObject(tokenSubset, `${category}-`);
  }

  return (
    <table className="ddsdocs-table">
      <thead className="ddsdocs-table__header">
        <tr className="ddsdocs-table__row">
          <td className="ddsdocs-table__header-cell">Navn</td>
          <td className="ddsdocs-table__header-cell">Verdi</td>
          {preview && <td className="ddsdocs-table__header-cell">Eksempel</td>}
        </tr>
      </thead>
      <tbody className="ddsdocs-table__body">
        {Object.entries(tokenMap).map(([key, value]) => (
          <TokenRow name={key} value={value} key={key} preview={preview}>
            {category === "color" && (
              <PreviewCell
                category={category}
                style={{ backgroundColor: value }}
              />
            )}
            {category === "spacing" && (
              <PreviewCell
                category={category}
                style={{ width: value, height: value }}
              />
            )}
            {category === "font-size" && (
              <PreviewCell category={category} style={{ fontSize: value }}>
                {textShortLorem}
              </PreviewCell>
            )}
            {category === "font-weight" && (
              <PreviewCell category={category} style={{ fontWeight: value }}>
                {textShortLorem}
              </PreviewCell>
            )}
            {category === "font-line-height" && (
              <PreviewCell category={category} style={{ lineHeight: value }}>
                {textLongLorem}
              </PreviewCell>
            )}
            {category === "border-width" && (
              <PreviewCell category={category} style={{ borderWidth: value }} />
            )}
            {category === "border-radius" && (
              <PreviewCell
                category={category}
                style={{ borderRadius: value }}
              />
            )}
            {category === "duration" && (
              <PreviewCell
                category={category}
                style={{ transitionDuration: value }}
              >
                {textDuration}
              </PreviewCell>
            )}
          </TokenRow>
        ))}
      </tbody>
    </table>
  );
};

export default TokenTable;
