import { describe, expect, it } from 'vitest';
import { toConfigTokensDir } from './generate-config.ts';

describe('toConfigTokensDir', () => {
  it('returns the tokens directory relative to the config directory', () => {
    expect(toConfigTokensDir('/project/design-tokens', '/project')).toBe('design-tokens');
    expect(toConfigTokensDir('/project/tokens', '/project/configs')).toBe('../tokens');
    expect(toConfigTokensDir('/project/src/design-tokens', '/project')).toBe('src/design-tokens');
  });

  it('allows a sibling directory whose name starts with the tokens directory name', () => {
    expect(toConfigTokensDir('/project/tokens', '/project/tokens-config')).toBe('../tokens');
  });

  // The generated `design-tokens` output would point to `.` or `..`, which `cleanDir` would delete.
  it.each([
    ['the tokens directory', '/project/design-tokens'],
    ['a subdirectory of the tokens directory', '/project/design-tokens/configs'],
  ])('rejects a config file in %s', (_, configDir) => {
    expect(() => toConfigTokensDir('/project/design-tokens', configDir)).toThrow(/inside the design tokens directory/);
  });
});
