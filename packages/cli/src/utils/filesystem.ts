import type { BigIntStats, CopyOptions, PathLike } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import type { OutputFile } from '../tokens/types.ts';

/** Identifies a file or directory on disk, however its path is written: letter case, `..`, or a symlink to it. */
const fileId = (stats: BigIntStats) => `${stats.dev}:${stats.ino}`;

const statId = async (file: string): Promise<string | undefined> => {
  try {
    return fileId(await fs.stat(file, { bigint: true }));
  } catch {
    return undefined;
  }
};

/**
 * Deletes everything in `dir` except the directories in `keep`, which can be anywhere inside it. Directories that
 * contain a kept directory are kept too, and are cleaned the same way. Symlinks are never followed: a symlink that
 * a kept directory is below is kept as it is, so nothing outside `dir` is deleted.
 *
 * Directories are matched by what they are on disk, not by their paths, so a kept directory is found also when its
 * path is written with other letter case than on disk, on case-insensitive file systems such as on Windows and macOS.
 */
export async function removeAllExcept(dir: string, keep: string[]): Promise<void> {
  const keptIds = new Set<string>();
  const containingIds = new Set<string>();
  for (const kept of keep) {
    const id = await statId(kept);
    // A kept directory that doesn't exist has nothing to keep.
    if (!id) continue;
    keptIds.add(id);
    for (
      let parent = path.dirname(path.resolve(kept));
      parent !== path.dirname(parent);
      parent = path.dirname(parent)
    ) {
      const parentId = await statId(parent);
      if (parentId) containingIds.add(parentId);
    }
  }

  await removeEntriesExcept(dir, keptIds, containingIds);
}

async function removeEntriesExcept(dir: string, keptIds: Set<string>, containingIds: Set<string>): Promise<void> {
  let entries: string[];
  try {
    // `dir` is the output directory, or a directory in it that a kept directory is below. Reading a symlink would
    // follow it, so a symlink is kept as it is. So is `dir` when it is a kept directory itself.
    const stats = await fs.lstat(dir, { bigint: true });
    if (stats.isSymbolicLink() || keptIds.has(fileId(stats))) return;
    entries = await fs.readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }

  await Promise.all(
    entries.map(async (name) => {
      const entry = path.join(dir, name);
      const id = await statId(entry);
      if (id && keptIds.has(id)) return;
      if (id && containingIds.has(id)) return removeEntriesExcept(entry, keptIds, containingIds);
      await fs.rm(entry, { recursive: true, force: true });
    }),
  );
}

class FileSystem {
  private isInitialized = false;
  private dry = false;
  private verbose = false;
  /** Default working directory is where the process was started */
  workingDir = process.cwd();
  outDir = this.workingDir;

  /** Initialize the file system */
  init({ dry, outdir, verbose }: { dry?: boolean; outdir?: string; verbose?: boolean }) {
    if (this.isInitialized) {
      console.warn(pc.yellow('FileSystem is already initialized. Ignoring subsequent init call.'));
      return;
    }

    if (dry) {
      console.log(pc.blue('Initializing FileSystem in dry-run mode. No files will be written.'));
    }

    this.dry = dry ?? false;
    this.verbose = verbose ?? false;
    // If a config file path is provided, set the working directory to the config file's directory. This allows relative paths in the config file to be resolved correctly. If no config file path is provided, use the current working directory.
    // this.workingDir = configFilePath ? path.dirname(configFilePath) : this.workingDir;
    // If an output directory is provided, resolve it relative to the working directory. Otherwise, use the working directory as the output directory.
    this.outDir = outdir ? (path.isAbsolute(outdir) ? outdir : path.join(this.workingDir, outdir)) : this.workingDir;
    if (this.verbose) {
      console.log(
        `FileSystem initialized with workingDir: ${pc.green(this.workingDir)}, outDir: ${pc.green(this.outDir)}`,
      );
    }
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

  /** Deletes `dir`, or only what's in it except the directories in `keep` when there are any. */
  cleanDir = async (dir: string, keep: string[] = []) => {
    const keeping = keep.length > 0 ? `, keeping ${keep.map((kept) => pc.blue(kept)).join(', ')}` : '';
    if (this.dry) {
      console.log(`${pc.blue('cleanDir')} ${dir}${keeping}`);
      return Promise.resolve();
    }

    console.log(`\n🔥 Cleaning dir ${pc.red(`${dir.trim()}`)}${keeping}`);

    if (keep.length === 0) {
      return fs.rm(dir, { recursive: true, force: true });
    }
    return removeAllExcept(dir, keep);
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
 * An abstraction of Node's file system API and helper functions for Designsystemet CLI interaction with the file system.
 *
 * Allows dry-running destructive operations, logging and store relevant file system state.
 */
export const dsfs = new FileSystem();
