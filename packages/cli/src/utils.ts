import type { CopyOptions } from 'node:fs';
import fs from 'node:fs/promises';
import pc from 'picocolors';

/**
 * Creates a directory if it does not already exist.
 *
 * @param dir - The path of the directory to create.
 * @param dry - Optional. If `true`, the function will log the operation
 * without actually creating the directory.
 *
 * @returns A promise that resolves when the operation is complete.
 * If the directory already exists or `dry` is `true`, the promise resolves immediately.
 */
export const mkdir = async (dir: string, dry?: boolean) => {
  if (dry) {
    console.log(`${pc.blue('mkdir')} ${dir}`);
    return Promise.resolve();
  }

  const exists = await fs
    .access(dir, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

  if (exists) {
    return Promise.resolve();
  }

  return fs.mkdir(dir, { recursive: true });
};

export const writeFile = async (path: string, data: string, dry?: boolean) => {
  if (dry) {
    console.log(`${pc.blue('writeFile')} ${path}`);
    return Promise.resolve();
  }

  return fs.writeFile(path, data, { encoding: 'utf-8' }).catch((error) => {
    console.error(pc.red(`Error writing file: ${path}`));
    console.error(pc.red(error));
    throw error;
  });
};

export const cp = async (src: string, dest: string, dry?: boolean, filter?: CopyOptions['filter']) => {
  if (dry) {
    console.log(`${pc.blue('cp')} ${src} ${dest}`);
    return Promise.resolve();
  }

  return fs.cp(src, dest, { recursive: true, filter });
};

export const copyFile = async (src: string, dest: string, dry?: boolean) => {
  if (dry) {
    console.log(`${pc.blue('copyFile')} ${src} to ${dest}`);
    return Promise.resolve();
  }

  return fs.copyFile(src, dest);
};

export const cleanDir = async (dir: string, dry?: boolean) => {
  if (dry) {
    console.log(`${pc.blue('cleanDir')} ${dir}`);
    return Promise.resolve();
  }

  console.log(`\n🔥 Cleaning dir ${pc.red(`${dir.trim()}`)} `);

  return fs.rm(dir, { recursive: true, force: true });
};

export const readFile = async (path: string, dry?: boolean, allowFileNotFound?: boolean) => {
  if (dry) {
    console.log(`${pc.blue('readFile')} ${path}`);
    return Promise.resolve('');
  }

  try {
    return await fs.readFile(path, 'utf-8');
  } catch (error) {
    if (allowFileNotFound && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return '';
    }
    throw error;
  }
};
