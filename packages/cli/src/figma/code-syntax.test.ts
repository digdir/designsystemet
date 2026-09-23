import { describe, expect, it } from 'vitest';
import { figmaCodeSyntax } from './code-syntax.ts';

describe('figmaCodeSyntax', () => {
  it('wraps the CSS property of a token in var()', () => {
    expect(figmaCodeSyntax({ path: ['border-radius', 'sm'], tokenSet: 'semantic/style' })).toBe(
      'var(--ds-border-radius-sm)',
    );
    expect(figmaCodeSyntax({ path: ['background-default'], tokenSet: 'semantic/color/accent' })).toBe(
      'var(--ds-color-background-default)',
    );
  });

  it('returns null for tokens without a CSS property', () => {
    expect(figmaCodeSyntax({ path: ['color', 'accent', '1'], tokenSet: 'themes/test' })).toBeNull();
    expect(figmaCodeSyntax({ path: ['size', '_base'], tokenSet: 'primitives/modes/size/medium' })).toBeNull();
    expect(figmaCodeSyntax({ path: ['_size', 'base'], tokenSet: 'primitives/modes/size/global' })).toBe(
      'var(--ds-size-base)',
    );
  });
});
