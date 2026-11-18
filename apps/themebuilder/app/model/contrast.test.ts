import { describe, expect, it } from 'vitest';
import {
  getContrastLevel,
  getContrastTargets,
  getMinContrast,
  textAndBorderSteps,
} from './contrast';

describe('contrast', () => {
  it('gives the WCAG level of a contrast ratio', () => {
    expect(getContrastLevel(2.9)).toBe('DECO');
    expect(getContrastLevel(3)).toBe('AA18');
    expect(getContrastLevel(4.5)).toBe('AA');
    expect(getContrastLevel(7)).toBe('AAA');
  });

  it('finds the required contrast between two steps in either direction', () => {
    const [target] = getContrastTargets(['text-default']);
    const required = getMinContrast('text-default', target);
    expect(required).toBeGreaterThanOrEqual(3);
    expect(getMinContrast(target, 'text-default')).toBe(required);
    expect(getMinContrast('text-default', 'text-default')).toBeUndefined();
  });

  it('lists text and border steps, and the steps they have requirements against', () => {
    expect(textAndBorderSteps).toContain('text-default');
    expect(textAndBorderSteps).toContain('border-default');
    expect(textAndBorderSteps).not.toContain('background-default');
    expect(getContrastTargets(textAndBorderSteps).length).toBeGreaterThan(0);
  });
});
