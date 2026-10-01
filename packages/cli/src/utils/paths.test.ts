import { describe, expect, it } from 'vitest';
import { isSameOrInside } from './paths.ts';

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
