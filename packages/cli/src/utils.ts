import type { CopyOptions } from 'node:fs';
import fs from 'node:fs/promises';
import chalk from 'chalk';

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
    console.log(`${chalk.blue('mkdir')} ${dir}`);
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
    console.log(`${chalk.blue('writeFile')} ${path}`);
    return Promise.resolve();
  }

  return fs.writeFile(path, data, { encoding: 'utf-8' }).catch((error) => {
    console.error(chalk.red(`Error writing file: ${path}`));
    console.error(chalk.red(error));
    throw error;
  });
};

export const cp = async (src: string, dest: string, dry?: boolean, filter?: CopyOptions['filter']) => {
  if (dry) {
    console.log(`${chalk.blue('cp')} ${src} ${dest}`);
    return Promise.resolve();
  }

  return fs.cp(src, dest, { recursive: true, filter });
};

export const copyFile = async (src: string, dest: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('copyFile')} ${src} to ${dest}`);
    return Promise.resolve();
  }

  return fs.copyFile(src, dest);
};

export const cleanDir = async (dir: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('cleanDir')} ${dir}`);
    return Promise.resolve();
  }

  console.log(`\n🔥 Cleaning dir ${chalk.red(`${dir.trim()}`)} `);

  return fs.rm(dir, { recursive: true, force: true });
};

export const readFile = async (path: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('readFile')} ${path}`);
    return Promise.resolve('');
  }

  return fs.readFile(path, 'utf-8');
};
