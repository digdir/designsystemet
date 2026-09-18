import { describe, expect, it } from 'vitest';
import { kebabCase } from './kebab-case.ts';

// Expected values verified against `change-case` 5.4.4, which Style Dictionary's `name/kebab` transform uses.
describe('kebabCase', () => {
  it.each([
    ['ds _size 0', 'ds-size-0'],
    ['ds _size mode-font-size', 'ds-size-mode-font-size'],
    ['ds typography heading 2xl fontSize', 'ds-typography-heading-2xl-font-size'],
    ['ds color brand1 base-default', 'ds-color-brand1-base-default'],
    ['ds color my-brand background-default', 'ds-color-my-brand-background-default'],
    ['ds letter-spacing 3', 'ds-letter-spacing-3'],
    ['Color Scheme', 'color-scheme'],
    ['ds size--sm', 'ds-size-sm'],
    ['XMLHttpRequest thing', 'xml-http-request-thing'],
    ['-leading and trailing-', 'leading-and-trailing'],
  ])('%s -> %s', (input, expected) => {
    expect(kebabCase(input)).toBe(expected);
  });
});
