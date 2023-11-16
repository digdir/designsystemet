import path from 'path';

/**
 *  @url https://github.com/madyankin/postcss-modules#generating-scoped-names
 * @param {string} selector
 * @param {string} fileNames
 * @returns
 */
export function generateScopedName(selector, fileNames) {
  const componentName = path.basename(fileNames, '.module.css').toLowerCase();

  return `fds-${componentName}-${selector}`;
}
