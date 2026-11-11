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

  // `cleanDir` is `false` by default, so the generated config doesn't delete the design tokens next to it.
  it('allows a config file in the tokens directory or below it', () => {
    expect(toConfigTokensDir('/project/design-tokens', '/project/design-tokens')).toBe('.');
    expect(toConfigTokensDir('/project/design-tokens', '/project/design-tokens/configs')).toBe('..');
  });
});
