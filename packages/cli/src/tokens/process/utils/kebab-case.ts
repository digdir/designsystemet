/**
 * Function to convert a string to kebab-case.
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Handle camelCase
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .toLowerCase();
}
