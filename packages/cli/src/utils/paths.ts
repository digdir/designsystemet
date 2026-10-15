import type { BigIntStats } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Whether `dir` is `parent` itself or somewhere inside it, by the paths as they are written. Use `locate` to compare
 * directories by what they are on disk.
 */
export const isSameOrInside = (dir: string, parent: string): boolean => {
  const fromParent = path.relative(path.resolve(parent), path.resolve(dir));

  return fromParent !== '..' && !fromParent.startsWith(`..${path.sep}`) && !path.isAbsolute(fromParent);
};

/** Identifies a file or directory on disk, however its path is written: letter case, `..`, or a symlink to it. */
export const fileId = (stats: BigIntStats) => `${stats.dev}:${stats.ino}`;

/** The identity of `file` on disk, following symlinks, or `undefined` when it doesn't exist. */
export const statId = async (file: string): Promise<string | undefined> => {
  try {
    return fileId(await fs.stat(file, { bigint: true }));
  } catch {
    return undefined;
  }
};

/**
 * Where a path is on disk, to compare paths by what they point to rather than by how they are written: with other
 * letter case on case-insensitive file systems such as on Windows and macOS, with `..`, or through symlinks.
 *
 * A path that doesn't exist yet, such as an output directory before the first run, is located by its nearest existing
 * parent and the names below it. Those names are compared ignoring letter case, since nothing on disk tells whether
 * the file system will tell them apart. They have no files to delete or keep, so the difference doesn't matter.
 */
export type Location = {
  /** The identities of the nearest existing file or directory at or above the path, and of each of its parents. */
  ids: string[];
  /** The names below the nearest existing directory that don't exist yet, in lowercase. */
  missing: string[];
};

export async function locate(file: string): Promise<Location> {
  const missing: string[] = [];
  let existing = path.resolve(file);
  let real: string | undefined;
  while (real === undefined) {
    try {
      real = await fs.realpath(existing);
    } catch {
      const parent = path.dirname(existing);
      if (parent === existing) return { ids: [], missing };
      missing.unshift(path.basename(existing).toLowerCase());
      existing = parent;
    }
  }

  // The parents of the real path are the parents on disk, wherever symlinks on the way to it point.
  const ids: string[] = [];
  for (let dir = real; ; dir = path.dirname(dir)) {
    const id = await statId(dir);
    if (id) ids.push(id);
    if (path.dirname(dir) === dir) break;
  }

  return { ids, missing };
}

const hasSameExisting = (a: Location, b: Location) => a.ids.length > 0 && a.ids[0] === b.ids[0];

/** Whether `a` and `b` are the same file or directory on disk. */
export const isSameLocation = (a: Location, b: Location): boolean =>
  hasSameExisting(a, b) && a.missing.length === b.missing.length && a.missing.every((name, i) => name === b.missing[i]);

/** Whether `child` is `parent` itself or somewhere inside it on disk. */
export const isSameOrInsideLocation = (child: Location, parent: Location): boolean => {
  if (parent.missing.length === 0) return parent.ids.length > 0 && child.ids.includes(parent.ids[0]);

  return hasSameExisting(child, parent) && parent.missing.every((name, i) => name === child.missing[i]);
};

/**
 * Whether cleaning `dir` deletes `file`, or a symlink that `file` is reached through. That is when `file`, or a
 * directory or symlink on the way to it, is in `dir` or in a directory inside it on disk. The way to `file` is
 * checked both as written and with symlinks resolved, so it is found however `file` and `dir` are written.
 */
export async function isReachedThrough(file: string, dir: Location): Promise<boolean> {
  const written = path.resolve(file);
  const real = await fs.realpath(written).catch(() => written);

  for (const start of new Set([written, real])) {
    for (let entry = start; path.dirname(entry) !== entry; entry = path.dirname(entry)) {
      if (isSameOrInsideLocation(await locate(path.dirname(entry)), dir)) return true;
    }
  }

  return false;
}
