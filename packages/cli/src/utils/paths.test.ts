import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isSameOrInside, protectedDirsInside, realPath } from './paths.ts';

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

describe('realPath', () => {
  let dir: string;

  beforeEach(async () => {
    // The temporary directory can itself be behind a symlink, e.g. /tmp on macOS.
    dir = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'designsystemet-paths-')));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('resolves a path through a symlink to the directory it points to', async () => {
    await fs.mkdir(path.join(dir, 'designsystemet/tokens'), { recursive: true });
    await fs.symlink(path.join(dir, 'designsystemet'), path.join(dir, 'link'), 'dir');

    expect(await realPath(path.join(dir, 'link/tokens'))).toBe(path.join(dir, 'designsystemet/tokens'));
  });

  it("keeps the part of the path that doesn't exist yet", async () => {
    await fs.mkdir(path.join(dir, 'designsystemet'));
    await fs.symlink(path.join(dir, 'designsystemet'), path.join(dir, 'link'), 'dir');

    expect(await realPath(path.join(dir, 'link/new/css'))).toBe(path.join(dir, 'designsystemet/new/css'));
  });
});

describe('protectedDirsInside', () => {
  const cleaned = { written: '/project/designsystemet', real: '/project/designsystemet' };

  it('keeps a directory inside the cleaned directory', () => {
    const tokens = { written: '/project/designsystemet/tokens', real: '/project/designsystemet/tokens' };

    expect(protectedDirsInside(cleaned, [tokens])).toEqual(['/project/designsystemet/tokens']);
  });

  // `designsystemet/tokens` links to `/shared/tokens`. Deleting the symlink would leave no tokens to build from.
  it('keeps a symlink inside the cleaned directory that points outside it', () => {
    const tokens = { written: '/project/designsystemet/tokens', real: '/shared/tokens' };

    expect(protectedDirsInside(cleaned, [tokens])).toEqual(['/project/designsystemet/tokens']);
  });

  // `tokens` links to `designsystemet/tokens`.
  it('keeps a directory inside the cleaned directory that is written through a symlink outside it', () => {
    const tokens = { written: '/project/tokens', real: '/project/designsystemet/tokens' };

    expect(protectedDirsInside(cleaned, [tokens])).toEqual(['/project/designsystemet/tokens']);
  });

  it('ignores directories outside the cleaned directory', () => {
    const tokens = { written: '/project/tokens', real: '/project/tokens' };

    expect(protectedDirsInside(cleaned, [tokens])).toEqual([]);
  });

  it('ignores letter case', () => {
    const tokens = { written: '/project/Designsystemet/Tokens', real: '/project/Designsystemet/Tokens' };

    expect(protectedDirsInside(cleaned, [tokens])).toEqual(['/project/Designsystemet/Tokens']);
  });
});
