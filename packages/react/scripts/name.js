import path from 'path';
/**
 *  @url https://github.com/madyankin/postcss-modules#generating-scoped-names
 * @param {string} selector
 * @param {string} fileName
 * @returns
 */
export function generateScopedName(selector, fileName) {
  const componentName = path
    .basename(fileName)
    .toLowerCase()
    .replace('.module', '')
    .replace('.css', '');
  return `fds-${componentName}-${selector}`;
}
