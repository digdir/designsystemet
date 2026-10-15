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

/** As many symlinks as Linux follows for one path, after which it stops with `ELOOP`. */
const MAX_SYMLINKS = 40;

/**
 * Every file, directory and symlink on the way to `file`, in the order they are reached: each part of the path, and
 * when a part is a symlink, each part of where it points, until `file` itself. This is how the operating system
 * follows a path, so every symlink in a chain of symlinks is found, also with relative targets. The way stops at a
 * part that doesn't exist, and after too many symlinks, such as in a cycle of symlinks.
 *
 * `..` after a symlink is the parent on disk of where the symlink points, except on Windows, where `..` is resolved
 * from the path as written, like Windows does.
 */
export async function entriesOnTheWay(file: string): Promise<string[]> {
  const windows = process.platform === 'win32';
  const split = (p: string) => p.split(windows ? /[\\/]+/ : '/').filter(Boolean);
  // Elsewhere, the path is kept as written, since `path.resolve` would remove `..` without following symlinks.
  const start = windows ? path.resolve(file) : path.isAbsolute(file) ? file : `${process.cwd()}${path.sep}${file}`;

  const entries: string[] = [];
  let dir = path.parse(start).root;
  const rest = split(start.slice(dir.length));
  let symlinks = 0;
  while (rest.length > 0) {
    const name = rest.shift() as string;
    if (name === '.') continue;
    if (name === '..') {
      dir = path.dirname(dir);
      continue;
    }

    const entry = path.join(dir, name);
    entries.push(entry);
    let target: string;
    try {
      if (!(await fs.lstat(entry)).isSymbolicLink()) {
        dir = entry;
        continue;
      }
      target = await fs.readlink(entry);
    } catch {
      break;
    }
    if (++symlinks > MAX_SYMLINKS) break;

    // Follow the symlink: go on from where it points, relative to the directory it is in.
    if (windows || path.isAbsolute(target)) {
      const resolved = path.resolve(dir, target);
      dir = path.parse(resolved).root;
      rest.unshift(...split(resolved.slice(dir.length)));
    } else {
      rest.unshift(...split(target));
    }
  }

  return entries;
}

/**
 * Whether cleaning `dir` deletes `file`, or a directory or symlink on the way to it (see `entriesOnTheWay`). That is
 * when any of them is in `dir`, or in a directory inside it, on disk. So it is found however `file` and `dir` are
 * written, also through chains of symlinks.
 */
export async function isReachedThrough(file: string, dir: Location): Promise<boolean> {
  for (const entry of await entriesOnTheWay(file)) {
    if (isSameOrInsideLocation(await locate(path.dirname(entry)), dir)) return true;
  }

  return false;
}
