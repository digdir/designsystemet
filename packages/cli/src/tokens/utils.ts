import fs from 'node:fs/promises';
import chalk from 'chalk';
import * as R from 'ramda';
import type { DesignToken, TransformedToken } from 'style-dictionary/types';

const mapToLowerCase = R.map<string, string>(R.toLower);

const hasAnyTruth = R.any(R.equals(true));

/**
 * Returns type based on design token format used. Read more:https://v4.styledictionary.com/info/dtcg/
 * @param token Transformed token
 * @returns type
 */
export const getType = (token: TransformedToken) => ((token.$type ?? token.type) as string) || '';

/**
 * Returns value based on design token format used. Read more:https://v4.styledictionary.com/info/dtcg/
 *
 * Use generic (`<T>`) to define return value type
 * @param token Transformed or Design token
 * @returns value
 */
export const getValue = <T>(token: TransformedToken | DesignToken): T => (token.$value ?? token.value) as T;

/**
 * Check if token type matches provided type
 * This function is curried
 * @param types Type or array of types to check against
 * @param token Transformed token
 * @returns boolean
 */
export const typeEquals = R.curry((types: string[] | string, token: TransformedToken) => {
  if (R.isNil(token)) {
    return false;
  }

  return R.includes(R.toLower(getType(token)), R.map(R.toLower, Array.isArray(types) ? types : [types]));
});

export const pathStartsWithOneOf = R.curry((paths: string[], token: TransformedToken) => {
  if (R.isNil(token)) {
    return false;
  }

  const tokenPath = mapToLowerCase(token.path);
  const matchPathsStartingWith = R.map((path) => R.startsWith([path], tokenPath), mapToLowerCase(paths));

  return hasAnyTruth(matchPathsStartingWith);
});

export function isSemanticToken(token: TransformedToken): boolean {
  return token.filePath.includes('semantic/');
}

export function isSemanticColorToken(token: TransformedToken, color?: string): boolean {
  return token.filePath.includes('semantic/') && R.startsWith(['color', color], token.path);
}

export function isGlobalColorToken(token: TransformedToken): boolean {
  return typeEquals('color', token) && pathStartsWithOneOf(['global'], token);
}

export function isColorCategoryToken(token: TransformedToken, category?: 'main' | 'support'): boolean {
  if (!category) {
    return (['main', 'support'] as const).some((c) => isColorCategoryToken(token, c));
  }
  return R.startsWith(['color', category], token.path);
}

export const mkdir = async (dir: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('mkdir')} ${dir}`);
    return Promise.resolve();
  }

  return await fs.mkdir(dir, { recursive: true });
};

export const writeFile = async (path: string, data: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('writeFile')} ${path}`);
    return Promise.resolve();
  }

  return await fs.writeFile(path, data, { encoding: 'utf-8' });
};

export const cp = async (src: string, dest: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('cp')} ${src} ${dest}`);
    return Promise.resolve();
  }

  return await fs.cp(src, dest, { recursive: true });
};

export const copyFile = async (src: string, dest: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('copyFile')} ${src} to ${dest}`);
    return Promise.resolve();
  }

  return await fs.copyFile(src, dest);
};

export const isDigit = (s: string) => /^\d+$/.test(s);

export const cleanDir = async (dir: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('cleanDir')} ${dir}`);
    return Promise.resolve();
  }

  console.log(`${chalk.red(`Cleaning outputDir: ${dir.trim()}`)} `);

  return await fs.rm(dir, { recursive: true, force: true });
};
