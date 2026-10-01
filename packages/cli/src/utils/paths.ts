import path from 'node:path';

/** Whether `dir` is `parent` itself or somewhere inside it. */
export const isSameOrInside = (dir: string, parent: string): boolean => {
  const fromParent = path.relative(path.resolve(parent), path.resolve(dir));

  return fromParent !== '..' && !fromParent.startsWith(`..${path.sep}`) && !path.isAbsolute(fromParent);
};
