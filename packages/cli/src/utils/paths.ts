import fs from 'node:fs/promises';
import path from 'node:path';

/** Whether `dir` is `parent` itself or somewhere inside it. */
export const isSameOrInside = (dir: string, parent: string): boolean => {
  const fromParent = path.relative(path.resolve(parent), path.resolve(dir));

  return fromParent !== '..' && !fromParent.startsWith(`..${path.sep}`) && !path.isAbsolute(fromParent);
};

/**
 * `dir` as an absolute path with symlinks resolved, so paths that reach the same directory through a symlink are
 * the same. The part of `dir` that doesn't exist yet, such as an output directory before the first run, is kept as
 * it is written.
 */
export const realPath = async (dir: string): Promise<string> => {
  const resolved = path.resolve(dir);
  try {
    return await fs.realpath(resolved);
  } catch {
    const parent = path.dirname(resolved);
    if (parent === resolved) return resolved;
    return path.join(await realPath(parent), path.basename(resolved));
  }
};

/** A directory as an absolute path, both as it is written and with symlinks resolved. */
export type ResolvedDir = { written: string; real: string };

/**
 * The directories in `protectedDirs` that are inside `dir`, to keep when `dir` is cleaned. They are compared both as
 * written and with symlinks resolved. As written finds a symlink inside `dir` that points somewhere else, e.g.
 * `designsystemet/design-tokens` linking to tokens outside `designsystemet`, which must be kept so the tokens can be
 * read through it. Resolved finds a directory inside `dir` that is written as a path through a symlink outside it.
 *
 * Letter case is ignored here, so no directory is missed on case-insensitive file systems. Cleaning matches the
 * directories on disk, so a directory that only looks the same here is not kept on case-sensitive ones.
 */
export const protectedDirsInside = (dir: ResolvedDir, protectedDirs: ResolvedDir[]): string[] => {
  const inside = (child: string, parent: string) => isSameOrInside(child.toLowerCase(), parent.toLowerCase());
  const kept = protectedDirs.flatMap(({ written, real }) => [
    ...(inside(written, dir.written) ? [written] : []),
    ...(inside(real, dir.real) ? [real] : []),
  ]);

  return [...new Set(kept)];
};
