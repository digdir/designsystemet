import path from 'path';

export function generateScopedName(selector, fileName) {
  const componentName = path
    .basename(fileName)
    .replace('.module', '')
    .replace('.css', '');
  return `fds-${componentName}-${selector}`;
}
