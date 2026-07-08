import type { LoadedFile } from './types';
import {
  getRelativePath,
  normalizePath,
  parseJsonLike,
  toTokenSetPath,
} from './utils';

export async function readTokenFiles(files: File[]): Promise<LoadedFile[]> {
  const tokenFiles = files
    .filter((file) => /\.(jsonc?|JSONC?)$/.test(file.name))
    .sort((a, b) => getRelativePath(a).localeCompare(getRelativePath(b)));

  if (tokenFiles.length === 0) {
    throw new Error('Fant ingen .json eller .jsonc-filer i mappen.');
  }

  const loaded: LoadedFile[] = [];

  for (const file of tokenFiles) {
    const path = normalizePath(getRelativePath(file));
    const text = await file.text();

    try {
      loaded.push({
        path,
        tokenSetPath: toTokenSetPath(path),
        size: file.size,
        data: parseJsonLike(text),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ugyldig JSON';
      loaded.push({
        path,
        tokenSetPath: toTokenSetPath(path),
        size: file.size,
        data: null,
        error: message,
      });
    }
  }

  return loaded;
}

export function flattenTokens(
  node: unknown,
  parts: string[] = [],
): Array<{
  path: string;
  type: string | null;
  value: unknown;
  description: string | null;
}> {
  const tokens: Array<{
    path: string;
    type: string | null;
    value: unknown;
    description: string | null;
  }> = [];

  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return tokens;
  }

  if (Object.hasOwn(node, '$value')) {
    const tokenNode = node as {
      $type?: string;
      $value: unknown;
      $description?: string;
    };

    tokens.push({
      path: parts.join('.'),
      type: tokenNode.$type || null,
      value: tokenNode.$value,
      description: tokenNode.$description || null,
    });
    return tokens;
  }

  for (const key of Object.keys(node)) {
    if (key.charAt(0) === '$') {
      continue;
    }

    const childTokens = flattenTokens(
      (node as Record<string, unknown>)[key],
      parts.concat(key),
    );
    for (const token of childTokens) {
      tokens.push(token);
    }
  }

  return tokens;
}

export function findReferences(value: unknown): string[] {
  const references = new Set<string>();
  collectReferences(value, references);
  return Array.from(references);
}

function collectReferences(value: unknown, references: Set<string>): void {
  if (typeof value === 'string') {
    const pattern = /\{([^}]+)\}/g;
    let match = pattern.exec(value);

    while (match) {
      references.add(match[1]);
      match = pattern.exec(value);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectReferences(item, references);
    }
    return;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      collectReferences(item, references);
    }
  }
}
