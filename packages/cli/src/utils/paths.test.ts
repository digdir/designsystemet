import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isReachedThrough, isSameLocation, isSameOrInside, isSameOrInsideLocation, locate } from './paths.ts';

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

describe('isSameOrInside', () => {
  it('is true for the directory itself and anything inside it', () => {
    expect(isSameOrInside('/project', '/project')).toBe(true);
    expect(isSameOrInside('/project/configs', '/project')).toBe(true);
    expect(isSameOrInside('/project/a/b', '/project')).toBe(true);
  });

  it('is false for parents and siblings', () => {
    expect(isSameOrInside('/project', '/project/configs')).toBe(false);
    expect(isSameOrInside('/project/other', '/project/configs')).toBe(false);
  });

  it('does not treat a sibling whose name starts with the directory name as inside it', () => {
    expect(isSameOrInside('/project/tokens-config', '/project/tokens')).toBe(false);
  });

  it('resolves relative paths', () => {
    expect(isSameOrInside('configs/..', '.')).toBe(true);
  });
});

describe('on disk', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-paths-'));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  const at = (file: string) => path.join(dir, file);
  const write = async (file: string) => {
    await fs.mkdir(path.dirname(at(file)), { recursive: true });
    await fs.writeFile(at(file), '');
  };

  describe('locate', () => {
    it('finds the same directory however its path is written', async () => {
      await fs.mkdir(at('designsystemet/tokens'), { recursive: true });
      await fs.symlink(at('designsystemet'), at('link'), 'dir');
      const tokens = await locate(at('designsystemet/tokens'));

      expect(isSameLocation(await locate(at('designsystemet/tokens/')), tokens)).toBe(true);
      expect(isSameLocation(await locate(at('designsystemet/other/../tokens')), tokens)).toBe(true);
      expect(isSameLocation(await locate(at('link/tokens')), tokens)).toBe(true);
      expect(isSameLocation(await locate(at('designsystemet')), tokens)).toBe(false);
    });

    it.runIf(caseInsensitive)('finds the same directory written with other letter case', async () => {
      await fs.mkdir(at('designsystemet/tokens'), { recursive: true });

      expect(isSameLocation(await locate(at('Designsystemet/Tokens')), await locate(at('designsystemet/tokens')))).toBe(
        true,
      );
    });

    // Before the first run, nothing on disk tells whether `Tokens` and `tokens` will be the same directory.
    it("ignores letter case in the part of the path that doesn't exist yet", async () => {
      await fs.symlink(dir, at('link'), 'dir');

      expect(isSameLocation(await locate(at('link/New/Tokens')), await locate(at('new/tokens')))).toBe(true);
      expect(isSameLocation(await locate(at('new/tokens')), await locate(at('new/other')))).toBe(false);
    });

    it('finds a directory inside another on disk', async () => {
      await fs.mkdir(at('designsystemet/tokens'), { recursive: true });
      await fs.symlink(at('designsystemet/tokens'), at('tokens'), 'dir');
      const designsystemet = await locate(at('designsystemet'));

      expect(isSameOrInsideLocation(await locate(at('tokens')), designsystemet)).toBe(true);
      expect(isSameOrInsideLocation(await locate(at('tokens/new')), designsystemet)).toBe(true);
      expect(isSameOrInsideLocation(designsystemet, await locate(at('tokens')))).toBe(false);
      expect(isSameOrInsideLocation(await locate(at('new/tokens')), await locate(at('New')))).toBe(true);
    });
  });

  describe('isReachedThrough', () => {
    it('is true for a file in the directory', async () => {
      await write('designsystemet/designsystemet.config.json');

      expect(
        await isReachedThrough(at('designsystemet/designsystemet.config.json'), await locate(at('designsystemet'))),
      ).toBe(true);
    });

    it('is false for a file outside the directory', async () => {
      await write('designsystemet.config.json');
      await fs.mkdir(at('designsystemet'));

      expect(await isReachedThrough(at('designsystemet.config.json'), await locate(at('designsystemet')))).toBe(false);
    });

    // `designsystemet.config.json` links to the config file in `designsystemet`, which cleaning would delete.
    it('is true for a symlink to a file in the directory', async () => {
      await write('designsystemet/real.config.json');
      await fs.symlink(at('designsystemet/real.config.json'), at('designsystemet.config.json'), 'file');

      expect(await isReachedThrough(at('designsystemet.config.json'), await locate(at('designsystemet')))).toBe(true);
    });

    // `designsystemet/design-tokens` links to tokens outside `designsystemet`. Cleaning would delete the symlink.
    it('is true for a file reached through a symlink in the directory', async () => {
      await write('shared/tokens/color.json');
      await fs.mkdir(at('designsystemet'));
      await fs.symlink(at('shared/tokens'), at('designsystemet/design-tokens'), 'dir');

      expect(await isReachedThrough(at('designsystemet/design-tokens'), await locate(at('designsystemet')))).toBe(true);
    });

    // The directory to clean is a symlink to the directory with the config file.
    it('is true when the directory is written as a symlink to where the file is', async () => {
      await write('project/designsystemet.config.json');
      await fs.symlink(at('project'), at('output'), 'dir');

      expect(await isReachedThrough(at('project/designsystemet.config.json'), await locate(at('output')))).toBe(true);
    });

    it.runIf(caseInsensitive)('is true for a file written with other letter case', async () => {
      await write('designsystemet/designsystemet.config.json');

      expect(
        await isReachedThrough(at('Designsystemet/designsystemet.config.json'), await locate(at('designsystemet'))),
      ).toBe(true);
    });

    it("is false when the directory doesn't exist", async () => {
      await write('designsystemet.config.json');

      expect(await isReachedThrough(at('designsystemet.config.json'), await locate(at('designsystemet')))).toBe(false);
    });
  });
});
