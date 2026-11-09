// An object whose only members are `light` and/or `dark` with string values, as JSON.stringify prints it with indentation.
const schemeObject = /\{\n(?:[ \t]*"(?:light|dark)": "[^"\n]*",?\n){1,2}[ \t]*\}/g;
const schemeMember = /"(light|dark)": "([^"\n]*)"/g;

/**
 * Formats a config as JSON with 2-space indentation, like `JSON.stringify(config, null, 2)`, but with every
 * `{ "light": …, "dark": … }` object on one line, so a color's steps read as one step per line:
 *
 * ```json
 * "background-default": { "light": "#ffffff", "dark": "#0c1927" },
 * ```
 */
export const stringifyConfig = (config: unknown): string =>
  JSON.stringify(config, null, 2).replace(schemeObject, (match) => {
    const members = [...match.matchAll(schemeMember)].map(([, key, value]) => `"${key}": "${value}"`);
    return `{ ${members.join(', ')} }`;
  });
