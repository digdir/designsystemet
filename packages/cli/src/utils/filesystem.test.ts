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
