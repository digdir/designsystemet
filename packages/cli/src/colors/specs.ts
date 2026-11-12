import type { SemanticColorNames, SemanticColorSpec } from './types.ts';
import { semanticColorMap } from './types.ts';

/**
 * Specification for a semantic color scale.
 *
 * Each step in the scale maps to a semantic color and corresponding specification for generating the color at that step.
 */
export const semanticColorSpec: SemanticColorSpec = {
  'background-default': {
    number: 1,
    name: 'background-default',
    group: 'background',
    displayName: 'Background Default',
    luminance: {
      light: 1,
      dark: 0.009,
    },
  },
  'background-tinted': {
    number: 2,
    name: 'background-tinted',
    group: 'background',
    displayName: 'Background Tinted',
    luminance: {
      light: 0.9,
      dark: 0.014,
    },
  },
  'surface-default': {
    number: 3,
    name: 'surface-default',
    group: 'surface',
    displayName: 'Surface Default',
    luminance: {
      light: 1,
      dark: 0.021,
    },
  },
  'surface-tinted': {
    number: 4,
    name: 'surface-tinted',
    group: 'surface',
    displayName: 'Surface Tinted',
    luminance: {
      light: 0.81,
      dark: 0.027,
    },
  },
  'surface-hover': {
    number: 5,
    name: 'surface-hover',
    group: 'surface',
    displayName: 'Surface Hover',
    luminance: {
      light: 0.7,
      dark: 0.036,
    },
  },
  'surface-active': {
    number: 6,
    name: 'surface-active',
    group: 'surface',
    displayName: 'Surface Active',
    luminance: {
      light: 0.59,
      dark: 0.056,
    },
  },
  'border-subtle': {
    number: 7,
    name: 'border-subtle',
    group: 'border',
    displayName: 'Border Subtle',
    luminance: {
      light: 0.5,
      dark: 0.08,
    },
  },
  'border-default': {
    number: 8,
    name: 'border-default',
    group: 'border',
    displayName: 'Border Default',
    luminance: {
      light: 0.19,
      dark: 0.22,
    },
  },
  'border-strong': {
    number: 9,
    name: 'border-strong',
    group: 'border',
    displayName: 'Border Strong',
    luminance: {
      light: 0.11,
      dark: 0.39,
    },
  },
  'text-subtle': {
    number: 10,
    name: 'text-subtle',
    group: 'text',
    displayName: 'Text Subtle',
    luminance: {
      light: 0.11,
      dark: 0.39,
    },
  },
  'text-default': {
    number: 11,
    name: 'text-default',
    group: 'text',
    displayName: 'Text Default',
    luminance: {
      light: 0.01,
      dark: 0.84,
    },
  },
  'base-default': {
    number: 12,
    name: 'base-default',
    group: 'base',
    displayName: 'Base Default',
    luminance: {
      light: 1,
      dark: 1,
    },
  },
  'base-hover': {
    number: 13,
    name: 'base-hover',
    group: 'base',
    displayName: 'Base Hover',
    luminance: {
      light: 1,
      dark: 1,
    },
  },
  'base-active': {
    number: 14,
    name: 'base-active',
    group: 'base',
    displayName: 'Base Active',
    luminance: {
      light: 1,
      dark: 1,
    },
  },
  'base-contrast-subtle': {
    number: 15,
    name: 'base-contrast-subtle',
    group: 'base',
    displayName: 'Contrast Subtle',
    luminance: {
      light: 1,
      dark: 1,
    },
  },
  'base-contrast-default': {
    number: 16,
    name: 'base-contrast-default',
    group: 'base',
    displayName: 'Contrast Default',
    luminance: {
      light: 1,
      dark: 1,
    },
  },
  'surface-muted': {
    number: 17,
    name: 'surface-muted',
    group: 'surface',
    displayName: 'Surface Muted',
    luminance: {
      light: 0.81,
      dark: 0.027,
    },
    chroma: {
      factor: { light: 0.2, dark: 0.4 },
      max: 0.03,
    },
  },
  'border-muted': {
    number: 18,
    name: 'border-muted',
    group: 'border',
    displayName: 'Border Muted',
    luminance: {
      light: 0.19,
      dark: 0.22,
    },
    chroma: {
      factor: { light: 0.2, dark: 0.4 },
      max: 0.03,
    },
  },
  'text-muted': {
    number: 19,
    name: 'text-muted',
    group: 'text',
    displayName: 'Text Muted',
    luminance: {
      light: 0.11,
      dark: 0.39,
    },
    chroma: {
      factor: { light: 0.2, dark: 0.4 },
      max: 0.03,
    },
  },
  'surface-invalid': {
    number: 20,
    name: 'surface-invalid',
    group: 'surface',
    displayName: 'Surface invalid',
    luminance: {
      light: 0.81,
      dark: 0.027,
    },
  },
  'border-invalid': {
    number: 21,
    name: 'border-invalid',
    group: 'border',
    displayName: 'Border invalid',
    luminance: {
      light: 0.19,
      dark: 0.22,
    },
  },
  'text-invalid': {
    number: 22,
    name: 'text-invalid',
    group: 'text',
    displayName: 'Text invalid',
    luminance: {
      light: 0.01,
      dark: 0.84,
    },
  },
};

export const semanticColorNames = Object.keys(semanticColorMap) as SemanticColorNames[];
