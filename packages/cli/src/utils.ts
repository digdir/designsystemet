import type { CopyOptions } from 'node:fs';
import fs from 'node:fs/promises';
import chalk from 'chalk';

/**
 * An abstraction of Node's file system API which allows dry-running destructive operations
 */
export class FileSystem {
  private dry: boolean;
  constructor(
    /** Dry-run destructive operations instead of actually performing them */
    dry = false,
  ) {
    this.dry = dry;
  }

  async mkdir(dir: string) {
    if (this.dry) {
      console.log(`${chalk.blue('mkdir')} ${dir}`);
      return Promise.resolve();
    }

    return fs.mkdir(dir, { recursive: true });
  }

  async writeFile(path: string, data: string) {
    if (this.dry) {
      console.log(`${chalk.blue('writeFile')} ${path}`);
      return Promise.resolve();
    }

    return fs.writeFile(path, data, { encoding: 'utf-8' }).catch((error) => {
      console.error(chalk.red(`Error writing file: ${path}`));
      console.error(chalk.red(error));
      throw error;
    });
  }

  async cp(src: string, dest: string, filter?: CopyOptions['filter']) {
    if (this.dry) {
      console.log(`${chalk.blue('cp')} ${src} ${dest}`);
      return Promise.resolve();
    }

    return fs.cp(src, dest, { recursive: true, filter });
  }

  async copyFile(src: string, dest: string) {
    if (this.dry) {
      console.log(`${chalk.blue('copyFile')} ${src} to ${dest}`);
      return Promise.resolve();
    }

    return fs.copyFile(src, dest);
  }

  async cleanDir(dir: string) {
    if (this.dry) {
      console.log(`${chalk.blue('cleanDir')} ${dir}`);
      return Promise.resolve();
    }

    console.log(`${chalk.red(`Cleaning dir: ${dir.trim()}`)} `);

    return fs.rm(dir, { recursive: true, force: true });
  }

  readFile = readFile;
}

// As readFile is inherently non-destructive and useful on its own, it is exported individually as well
export async function readFile(path: string) {
  return fs.readFile(path, 'utf-8');
}
