import type { CopyOptions, PathLike } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import type { OutputFile } from '../tokens/types.js';

class FileSystem {
  private isInitialized = false;
  private dry = false;
  /** Resolved write directory */
  writeDir = process.cwd();

  /** Initialize the file system */
  init({ dry, writeDir }: { dry?: boolean; writeDir?: string }) {
    if (this.isInitialized) {
      console.warn(pc.yellow('FileSystem is already initialized. Ignoring subsequent init call.'));
      return;
    }

    if (dry) {
      console.log(pc.blue('Initializing FileSystem in dry-run mode. No files will be written.'));
    }

    this.dry = dry ?? false;
    this.writeDir = writeDir ?? process.cwd();
    this.isInitialized = true;
  }

  /**
   * Creates a directory if it does not already exist.
   *
   * @param dir - The path of the directory to create.
   *
   * @returns A promise that resolves when the operation is complete.
   * If the directory already exists or `dry` is `true`, the promise resolves immediately.
   */
  mkdir = async (dir: PathLike) => {
    if (this.dry) {
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

  writeFile = async (path: PathLike, data: string) => {
    if (this.dry) {
      console.log(`${pc.blue('writeFile')} ${path}`);
      return Promise.resolve();
    }

    return fs.writeFile(path, data, { encoding: 'utf-8' }).catch((error) => {
      console.error(pc.red(`Error writing file: ${path}`));
      console.error(pc.red(error));
      throw error;
    });
  };

  cp = async (src: string, dest: string, filter?: CopyOptions['filter']) => {
    if (this.dry) {
      console.log(`${pc.blue('cp')} ${src} ${dest}`);
      return Promise.resolve();
    }

    return fs.cp(src, dest, { recursive: true, filter });
  };

  copyFile = async (src: PathLike, dest: PathLike) => {
    if (this.dry) {
      console.log(`${pc.blue('copyFile')} ${src} to ${dest}`);
      return Promise.resolve();
    }

    return fs.copyFile(src, dest);
  };

  cleanDir = async (dir: string) => {
    if (this.dry) {
      console.log(`${pc.blue('cleanDir')} ${dir}`);
      return Promise.resolve();
    }

    console.log(`\n🔥 Cleaning dir ${pc.red(`${dir.trim()}`)} `);

    return fs.rm(dir, { recursive: true, force: true });
  };

  readFile = async (path: PathLike, allowFileNotFound?: boolean) => {
    if (this.dry) {
      console.log(`${pc.blue('readFile')} ${path}`);
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
  readdir = async (path: PathLike) => {
    if (this.dry) {
      console.log(`${pc.blue('readdir')} ${path}`);
    }

    try {
      return await fs.readdir(path);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  };
  writeFiles = async (files: OutputFile[], outDir: string, log?: boolean) => {
    for (const { destination: filename, output } of files) {
      if (filename) {
        const filePath = path.join(outDir, filename);
        const fileDir = path.dirname(filePath);

        if (log) {
          console.log(filename);
        }

        await this.mkdir(fileDir);
        await this.writeFile(filePath, output);
      }
    }
  };
}

/**
 * An abstraction of Node's file system API and helper functions for CLI interaction with the file system.
 *
 * Allows dry-running destructive operations, logging and store relevant file system state.
 */
export default new FileSystem();
