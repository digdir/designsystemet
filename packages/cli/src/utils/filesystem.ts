import type { CopyOptions, PathLike } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import type { OutputFile } from '../tokens/types.ts';
import { entriesOnTheWay, fileId, isNotFound, statId } from './paths.ts';

/**
 * Deletes everything in `dir` except the directories in `keep`, and the directories they are in. Those are cleaned
 * the same way. `dir` is followed when it is a symlink, since it is the directory to clean wherever it is. Symlinks
 * inside it are deleted, or kept when a kept directory is reached through them, and never followed, so nothing
 * outside `dir` is deleted.
 *
 * Directories are matched by what they are on disk, not by their paths. So a kept directory is found however its
 * path is written: with other letter case on case-insensitive file systems such as on Windows and macOS, or through
 * symlinks, also chains of them, either inside `dir` or outside it. Kept directories that aren't in `dir` are ignored,
 * and ones that don't exist yet only keep the symlinks on the way to them.
 *
 * For the directories in `keepWayTo`, only the symlinks on the way to them are kept, so they are created or written
 * where the symlinks point. Everything else in them is deleted.
 */
export async function removeAllExcept(dir: string, keep: string[], keepWayTo: string[] = []): Promise<void> {
  const keptIds = new Set<string>();
  const containingIds = new Set<string>();
  for (const kept of [...keep, ...keepWayTo]) {
    // The directories and symlinks on the way to the kept directory, following every symlink, so the ones in `dir`
    // are kept too. Also when the kept directory doesn't exist yet: a symlink on the way to it decides where it is
    // created.
    for (const entry of await entriesOnTheWay(kept)) {
      const entryId = await statId(entry);
      if (entryId) containingIds.add(entryId);
    }
  }
  for (const kept of keep) {
    // The kept directory itself is checked before the ones containing it, so it is kept as it is.
    const id = await statId(kept);
    if (id) keptIds.add(id);
  }

  let realDir: string;
  try {
    realDir = await fs.realpath(dir);
  } catch (error) {
    if (isNotFound(error)) return;
    throw error;
  }
  await removeEntriesExcept(realDir, keptIds, containingIds);
}

async function removeEntriesExcept(dir: string, keptIds: Set<string>, containingIds: Set<string>): Promise<void> {
  // `dir` is the directory to clean, or a directory or symlink in it that a kept directory is reached through.
  // Reading a symlink would follow it, so a symlink is kept as it is. So is `dir` when it is a kept directory itself.
  const stats = await fs.lstat(dir, { bigint: true });
  if (stats.isSymbolicLink() || keptIds.has(fileId(stats))) return;
  const entries = await Promise.all(
    (await fs.readdir(dir)).map(async (name) => {
      const entry = path.join(dir, name);
      return { entry, id: await statId(entry) };
    }),
  );

  // Every entry is looked up, and every directory below is cleaned, before anything here is deleted. So when one
  // can't be looked up, e.g. without permission to read it, cleaning stops before deleting what it should keep.
  await Promise.all(
    entries.flatMap(({ entry, id }) =>
      id && !keptIds.has(id) && containingIds.has(id) ? [removeEntriesExcept(entry, keptIds, containingIds)] : [],
    ),
  );
  await Promise.all(
    entries.flatMap(({ entry, id }) =>
      id && (keptIds.has(id) || containingIds.has(id)) ? [] : [fs.rm(entry, { recursive: true, force: true })],
    ),
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

  cleanDir = async (dir: string) => {
    if (this.dry) {
      console.log(`${pc.blue('cleanDir')} ${dir}`);
      return Promise.resolve();
    }

    console.log(`\n🔥 Cleaning dir ${pc.red(`${dir.trim()}`)} `);

    return fs.rm(dir, { recursive: true, force: true });
  };

  /** Deletes what's in `dir`, except the directories in `keep`, and the symlinks on the way to `keepWayTo`. See `removeAllExcept`. */
  emptyDir = async (dir: string, keep: string[] = [], keepWayTo: string[] = []) => {
    const keeping = keep.length > 0 ? `, keeping ${keep.map((kept) => pc.blue(kept)).join(', ')}` : '';
    if (this.dry) {
      console.log(`${pc.blue('emptyDir')} ${dir}${keeping}`);
      return Promise.resolve();
    }

    console.log(`\n🔥 Cleaning dir ${pc.red(`${dir.trim()}`)}${keeping}`);

    return removeAllExcept(dir, keep, keepWayTo);
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
