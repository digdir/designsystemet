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
