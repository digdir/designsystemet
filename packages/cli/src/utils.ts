import type { CopyOptions } from 'node:fs';
import fs from 'node:fs/promises';
import chalk from 'chalk';

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

export const cp = async (src: string, dest: string, dry?: boolean, filter?: CopyOptions['filter']) => {
  if (dry) {
    console.log(`${chalk.blue('cp')} ${src} ${dest}`);
    return Promise.resolve();
  }

  return await fs.cp(src, dest, { recursive: true, filter });
};

export const copyFile = async (src: string, dest: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('copyFile')} ${src} to ${dest}`);
    return Promise.resolve();
  }

  return await fs.copyFile(src, dest);
};

export const cleanDir = async (dir: string, dry?: boolean) => {
  if (dry) {
    console.log(`${chalk.blue('cleanDir')} ${dir}`);
    return Promise.resolve();
  }

  console.log(`${chalk.red(`Cleaning dir: ${dir.trim()}`)} `);

  return await fs.rm(dir, { recursive: true, force: true });
};
