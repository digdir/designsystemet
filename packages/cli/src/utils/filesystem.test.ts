import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { removeAllExcept } from './filesystem.ts';

describe('removeAllExcept', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-clean-'));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  const write = async (file: string) => {
    await fs.mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await fs.writeFile(path.join(dir, file), '');
  };

  const files = async () =>
    (await fs.readdir(dir, { recursive: true, withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
      .sort();

  it('deletes everything except the kept directories, also when they are nested', async () => {
    await write('theme.css');
    await write('types.d.ts');
    await write('design-tokens/semantic/color.json');
    await write('old/file.css');
    await write('nested/kept/tokens.json');
    await write('nested/other.css');

    await removeAllExcept(dir, [path.join(dir, 'design-tokens'), path.join(dir, 'nested/kept')]);

    expect(await files()).toEqual(['design-tokens/semantic/color.json', 'nested/kept/tokens.json']);
  });

  // A kept directory can be below a symlink by path. Following the symlink would delete files outside `dir`.
  it('does not follow a symlink that a kept directory is below', async () => {
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-outside-'));
    try {
      await fs.mkdir(path.join(outside, 'tokens'));
      await fs.writeFile(path.join(outside, 'sibling.css'), '');
      await fs.symlink(outside, path.join(dir, 'link'), 'dir');
      await write('theme.css');

      await removeAllExcept(dir, [path.join(dir, 'link/tokens')]);

      expect((await fs.lstat(path.join(dir, 'link'))).isSymbolicLink()).toBe(true);
      expect((await fs.readdir(outside)).sort()).toEqual(['sibling.css', 'tokens']);
      expect(await files()).toEqual([]);
    } finally {
      await fs.rm(outside, { recursive: true, force: true });
    }
  });

  it('deletes symlinks without following them when nothing below them is kept', async () => {
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-outside-'));
    try {
      await fs.writeFile(path.join(outside, 'sibling.css'), '');
      await fs.symlink(outside, path.join(dir, 'link'), 'dir');

      await removeAllExcept(dir, []);

      await expect(fs.lstat(path.join(dir, 'link'))).rejects.toThrow();
      expect(await fs.readdir(outside)).toEqual(['sibling.css']);
    } finally {
      await fs.rm(outside, { recursive: true, force: true });
    }
  });

  it('deletes everything when nothing is kept', async () => {
    await write('theme.css');
    await write('old/file.css');

    await removeAllExcept(dir, []);

    expect(await files()).toEqual([]);
  });

  it('does nothing when the directory does not exist', async () => {
    await expect(removeAllExcept(path.join(dir, 'missing'), [])).resolves.toBeUndefined();
  });
});
