import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanDirs, removeAllExcept } from './filesystem.ts';

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

  // The CLI refuses to clean when a kept directory is reached through a symlink in the directory, since the symlink
  // is deleted. Either way, the symlink is never followed, so nothing outside the directory is deleted.
  it('deletes symlinks without following them, also when a kept directory is reached through them', async () => {
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-outside-'));
    try {
      await fs.mkdir(path.join(outside, 'tokens'));
      await fs.writeFile(path.join(outside, 'sibling.css'), '');
      await fs.symlink(outside, path.join(dir, 'link'), 'dir');
      await fs.symlink(path.join(outside, 'tokens'), path.join(dir, 'design-tokens'), 'dir');
      await write('theme.css');

      await removeAllExcept(dir, [path.join(dir, 'link/tokens'), path.join(dir, 'design-tokens')]);

      expect(await fs.readdir(dir)).toEqual([]);
      expect((await fs.readdir(outside)).sort()).toEqual(['sibling.css', 'tokens']);
    } finally {
      await fs.rm(outside, { recursive: true, force: true });
    }
  });

  // The CLI refuses to clean an output directory that is a symlink, since that would delete files where it points.
  it('refuses to clean a directory that is a symlink', async () => {
    await write('outside/old.css');
    const link = path.join(dir, 'output');
    await fs.symlink(path.join(dir, 'outside'), link, 'dir');

    await expect(removeAllExcept(link, [])).rejects.toThrow(/isn't a directory/);

    expect(await files()).toEqual(['outside/old.css']);
  });

  // `tokens` links to `output/nested/tokens`. The directories on the way to it on disk are kept too.
  it('keeps a kept directory written as a path through a symlink outside the directory', async () => {
    await write('output/nested/tokens/color.json');
    await write('output/nested/old.css');
    await write('output/theme.css');
    await fs.symlink(path.join(dir, 'output/nested/tokens'), path.join(dir, 'tokens'), 'dir');

    await removeAllExcept(path.join(dir, 'output'), [path.join(dir, 'tokens')]);

    expect(await files()).toEqual(['output/nested/tokens/color.json']);
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

  // The kept `output/link` points into `locked`, which can't be read. What it is can't be known, so nothing is deleted.
  it.skipIf(process.platform === 'win32' || process.getuid?.() === 0)(
    "stops without deleting anything when a path can't be looked up",
    async () => {
      await fs.mkdir(path.join(dir, 'locked/tokens'), { recursive: true });
      await write('output/theme.css');
      await fs.symlink(path.join(dir, 'locked/tokens'), path.join(dir, 'output/link'), 'dir');
      await fs.chmod(path.join(dir, 'locked'), 0o000);
      try {
        await expect(removeAllExcept(path.join(dir, 'output'), [path.join(dir, 'output/link')])).rejects.toThrow(
          /EACCES/,
        );
        expect((await fs.lstat(path.join(dir, 'output/link'))).isSymbolicLink()).toBe(true);
        expect((await fs.stat(path.join(dir, 'output/theme.css'))).isFile()).toBe(true);
      } finally {
        await fs.chmod(path.join(dir, 'locked'), 0o755);
      }
    },
  );

  // `b` can be entered but not read, so what is in it can't be known. Nothing is deleted, also not in `a`.
  it.skipIf(process.platform === 'win32' || process.getuid?.() === 0)(
    "deletes nothing when a directory to clean can't be read",
    async () => {
      await write('a/stale.css');
      await write('a/keep/tokens.json');
      await write('b/stale.css');
      await write('b/keep/tokens.json');
      await fs.chmod(path.join(dir, 'b'), 0o111);
      try {
        await expect(removeAllExcept(dir, [path.join(dir, 'a/keep'), path.join(dir, 'b/keep')])).rejects.toThrow(
          /EACCES/,
        );
      } finally {
        await fs.chmod(path.join(dir, 'b'), 0o755);
      }

      expect(await files()).toEqual(['a/keep/tokens.json', 'a/stale.css', 'b/keep/tokens.json', 'b/stale.css']);
    },
  );

  it.skipIf(process.platform === 'win32' || process.getuid?.() === 0)(
    "deletes nothing in any directory when another directory to clean can't be read",
    async () => {
      await write('css/stale.css');
      await write('types/keep/tokens.json');
      await write('types/stale.d.ts');
      await fs.chmod(path.join(dir, 'types'), 0o111);
      try {
        await expect(
          cleanDirs([
            { dir: path.join(dir, 'css'), keep: [] },
            { dir: path.join(dir, 'types'), keep: [path.join(dir, 'types/keep')] },
          ]),
        ).rejects.toThrow(/EACCES/);
      } finally {
        await fs.chmod(path.join(dir, 'types'), 0o755);
      }

      expect(await files()).toEqual(['css/stale.css', 'types/keep/tokens.json', 'types/stale.d.ts']);
    },
  );

  // `types/locked` is deleted with everything in it, but can't be read, so nothing is deleted, also not in `css`.
  it.skipIf(process.platform === 'win32' || process.getuid?.() === 0)(
    "deletes nothing when a directory to delete can't be read",
    async () => {
      await write('css/stale.css');
      await write('types/locked/stale.d.ts');
      await fs.chmod(path.join(dir, 'types/locked'), 0o111);
      try {
        await expect(
          cleanDirs([
            { dir: path.join(dir, 'css'), keep: [] },
            { dir: path.join(dir, 'types'), keep: [] },
          ]),
        ).rejects.toThrow(/EACCES/);
      } finally {
        await fs.chmod(path.join(dir, 'types/locked'), 0o755);
      }

      expect(await files()).toEqual(['css/stale.css', 'types/locked/stale.d.ts']);
    },
  );

  it.skipIf(process.platform === 'win32' || process.getuid?.() === 0)(
    "deletes nothing when files in a directory to clean can't be deleted",
    async () => {
      await write('css/stale.css');
      await write('types/stale.d.ts');
      await fs.chmod(path.join(dir, 'types'), 0o555);
      try {
        await expect(
          cleanDirs([
            { dir: path.join(dir, 'css'), keep: [] },
            { dir: path.join(dir, 'types'), keep: [] },
          ]),
        ).rejects.toThrow(/EACCES/);
      } finally {
        await fs.chmod(path.join(dir, 'types'), 0o755);
      }

      expect(await files()).toEqual(['css/stale.css', 'types/stale.d.ts']);
    },
  );

  it('cleans directories that are inside each other', async () => {
    await write('out/stale.css');
    await write('out/sub/stale.css');

    await cleanDirs([
      { dir: path.join(dir, 'out/sub'), keep: [] },
      { dir: path.join(dir, 'out'), keep: [] },
    ]);

    expect(await fs.readdir(path.join(dir, 'out'))).toEqual([]);
  });

  it('deletes symlinks that point nowhere or to each other', async () => {
    await fs.mkdir(path.join(dir, 'output'));
    await fs.symlink(path.join(dir, 'missing'), path.join(dir, 'output/dangling'), 'dir');
    await fs.symlink(path.join(dir, 'output/b'), path.join(dir, 'output/a'), 'dir');
    await fs.symlink(path.join(dir, 'output/a'), path.join(dir, 'output/b'), 'dir');

    await removeAllExcept(path.join(dir, 'output'), [path.join(dir, 'output/a/tokens')]);

    expect(await fs.readdir(path.join(dir, 'output'))).toEqual([]);
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
