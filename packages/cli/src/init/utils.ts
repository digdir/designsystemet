import { kebabCase } from 'change-case';

export function normalizeTokenSetName(name: string): string {
  return kebabCase(name);
}

export function toGeneratedCssFileName(name: string): string {
  // This needs to match the output from `npx @digdir/designsystemet tokens`
  return `${name.toLowerCase()}.css`;
}

export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-');
}
