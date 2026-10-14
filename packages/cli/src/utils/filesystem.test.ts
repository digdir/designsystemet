import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { removeAllExcept } from './filesystem.ts';

// Whether the temporary directory's file system ignores letter case, as on Windows and macOS by default.
const caseInsensitive = await (async () => {
  const probe = await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-case-'));
  try {
    await fs.writeFile(path.join(probe, 'a'), '');
    return await fs
      .access(path.join(probe, 'A'))
      .then(() => true)
      .catch(() => false);
  } finally {
    await fs.rm(probe, { recursive: true, force: true });
  }
})();

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

  // `designsystemet/design-tokens` can be a symlink to tokens outside `designsystemet`. The tokens are read through it.
  it('keeps a kept directory that is a symlink, and what it points to', async () => {
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-outside-'));
    try {
      await fs.writeFile(path.join(outside, 'color.json'), '');
      await fs.symlink(outside, path.join(dir, 'design-tokens'), 'dir');
      await write('theme.css');

      await removeAllExcept(dir, [path.join(dir, 'design-tokens')]);

      expect((await fs.lstat(path.join(dir, 'design-tokens'))).isSymbolicLink()).toBe(true);
      expect(await fs.readdir(outside)).toEqual(['color.json']);
      expect(await files()).toEqual([]);
    } finally {
      await fs.rm(outside, { recursive: true, force: true });
    }
  });

  // The output directory itself can be a symlink. Reading it would follow it and delete files outside it.
  it('does not follow the directory itself when it is a symlink', async () => {
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-outside-'));
    try {
      await fs.mkdir(path.join(outside, 'tokens'));
      await fs.writeFile(path.join(outside, 'sibling.css'), '');
      const link = path.join(dir, 'output');
      await fs.symlink(outside, link, 'dir');

      await removeAllExcept(link, [path.join(link, 'tokens')]);

      expect((await fs.lstat(link)).isSymbolicLink()).toBe(true);
      expect((await fs.readdir(outside)).sort()).toEqual(['sibling.css', 'tokens']);
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

  // `designsystemet/Design-Tokens` in a config is the same directory as `designsystemet/design-tokens` on disk there.
  it.runIf(caseInsensitive)('keeps a kept directory written with other letter case than on disk', async () => {
    await write('theme.css');
    await write('nested/design-tokens/semantic/color.json');

    await removeAllExcept(dir, [path.join(dir, 'Nested/Design-Tokens')]);

    expect(await files()).toEqual(['nested/design-tokens/semantic/color.json']);
  });

  it.runIf(caseInsensitive)('keeps everything when the directory is a kept directory itself', async () => {
    await write('tokens/color.json');

    await removeAllExcept(path.join(dir, 'tokens'), [path.join(dir, 'Tokens')]);

    expect(await files()).toEqual(['tokens/color.json']);
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
