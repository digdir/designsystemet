import { afterEach, describe, expect, it, vi } from 'vitest';
import { saveVersion } from './save-version';

describe('saveVersion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('saves a version with the name, and returns the name', async () => {
    const saveVersionHistoryAsync = vi.fn(async () => ({ id: '1' }));
    vi.stubGlobal('figma', { saveVersionHistoryAsync });

    expect(await saveVersion('Before theme import')).toBe(
      'Before theme import',
    );
    expect(saveVersionHistoryAsync).toHaveBeenCalledWith(
      'Before theme import',
      expect.any(String),
    );
  });

  it.each([
    ['returns nothing', async () => null],
    [
      'fails',
      async () => {
        throw new Error('No access');
      },
    ],
  ])('returns undefined when Figma %s', async (_, save) => {
    vi.stubGlobal('figma', { saveVersionHistoryAsync: save });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(await saveVersion('Before theme import')).toBeUndefined();
  });
});
