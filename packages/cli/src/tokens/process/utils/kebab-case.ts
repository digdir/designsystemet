/**
 * Converts a string to kebab-case the way Style Dictionary's `name/kebab` transform does (it uses `change-case`),
 * so CSS custom property names derived here match the build output:
 * `'ds _size 4'` -> `'ds-size-4'`, `'fontSize'` -> `'font-size'`, `'2xl'` stays `'2xl'`.
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase boundaries: fontSize -> font-Size
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2') // acronym boundaries: XMLHttp -> XML-Http
    .replace(/[^a-zA-Z0-9]+/g, '-') // any run of separators (space, underscore, hyphen) -> one hyphen
    .replace(/^-|-$/g, '')
    .toLowerCase();
}
