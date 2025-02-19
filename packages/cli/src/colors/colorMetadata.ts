import * as R from 'ramda';
import type { ColorMetadataByName, ColorMetadataByNumber, CssColor, GlobalColors } from './types.js';

export const baseColors: Record<GlobalColors, CssColor> = {
  blue: '#0A71C0',
  green: '#068718',
  orange: '#EA9B1B',
  purple: '#663299',
  red: '#C01B1B',
};

export const colorMetadata: ColorMetadataByName = {
  'background-default': {
    number: 1,
    name: 'background-default',
    group: 'background',
    displayName: 'Background Default',
    description: 'Background Default er den mest nøytrale bakgrunnsfargen.',
    luminance: {
      light: 1,
      dark: 0.011,
      contrast: 0.001,
    },
  },
  'background-tinted': {
    number: 2,
    name: 'background-tinted',
    group: 'background',
    displayName: 'Background Tinted',
    description: 'Background Tinted er en bakgrunnsfarge som har et hint av farge i seg.',
    luminance: {
      light: 0.9,
      dark: 0.017,
      contrast: 0.0065,
    },
  },
  'surface-default': {
    number: 3,
    name: 'surface-default',
    group: 'surface',
    displayName: 'Surface Default',
    description:
      'Surface Default brukes på flater som ligger oppå bakgrunnsfargene. Dette er den mest nøytrale surface fargen.',
    luminance: {
      light: 1,
      dark: 0.025,
      contrast: 0.015,
    },
  },
  'surface-tinted': {
    number: 4,
    name: 'surface-tinted',
    group: 'surface',
    displayName: 'Surface Tinted',
    description: 'Surface Tinted brukes på flater som ligger oppå bakgrunnsfargene. Denne har et hint av farge i seg.',
    luminance: {
      light: 0.81,
      dark: 0.035,
      contrast: 0.015,
    },
  },
  'surface-hover': {
    number: 5,
    name: 'surface-hover',
    group: 'surface',
    displayName: 'Surface Hover',
    description: 'Surface Hover brukes på interaktive flater som ligger oppå bakgrunnsfargene i en hover state.',
    luminance: {
      light: 0.7,
      dark: 0.044,
      contrast: 0.028,
    },
  },
  'surface-active': {
    number: 6,
    name: 'surface-active',
    group: 'surface',
    displayName: 'Surface Active',
    description: 'Surface Active brukes på interaktive flater som ligger oppå bakgrunnsfargene i en active state.',
    luminance: {
      light: 0.6,
      dark: 0.057,
      contrast: 0.045,
    },
  },
  'border-subtle': {
    number: 7,
    name: 'border-subtle',
    group: 'border',
    displayName: 'Border Subtle',
    description: 'Border Subtle er den lyseste border-fargen og brukes for å skille elementer fra hverandre.',
    luminance: {
      light: 0.5,
      dark: 0.082,
      contrast: 0.26,
    },
  },
  'border-default': {
    number: 8,
    name: 'border-default',
    group: 'border',
    displayName: 'Border Default',
    description: 'Border Default er en border-farge som brukes når man ønsker god kontrast mot bakgrunnsfargene.',
    luminance: {
      light: 0.21,
      dark: 0.2,
      contrast: 0.4,
    },
  },
  'border-strong': {
    number: 9,
    name: 'border-strong',
    group: 'border',
    displayName: 'Border Strong',
    description:
      'Border Strong er den mørkeste border-fargen og brukes når man ønsker en veldig tydelig og sterk border.',
    luminance: {
      light: 0.12,
      dark: 0.36,
      contrast: 0.6,
    },
  },
  'text-subtle': {
    number: 10,
    name: 'text-subtle',
    group: 'text',
    displayName: 'Text Subtle',
    description:
      'Text Subtle er den lyseste tekstfargen og brukes på tekst som skal være litt mindre synlig eller for å skape variasjon i typografien.',
    luminance: {
      light: 0.12,
      dark: 0.36,
      contrast: 0.57,
    },
  },
  'text-default': {
    number: 11,
    name: 'text-default',
    group: 'text',
    displayName: 'Text Default',
    description:
      'Text Default er den mørkeste tekstfargen og brukes på tekst som skal være mest synlig. Denne fargen bør brukes på mesteparten av teksten på en side.',
    luminance: {
      light: 0.0245,
      dark: 0.78,
      contrast: 0.86,
    },
  },
  'base-default': {
    number: 12,
    name: 'base-default',
    group: 'base',
    displayName: 'Base Default',
    description:
      'Base Default fargen får den samme hex koden som fargen som er valgt i verktøyet. Brukes ofte som farge på viktige elementer og på flater som skal fange brukerens oppmerksomhet.',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
  },
  'base-hover': {
    number: 13,
    name: 'base-hover',
    group: 'base',
    displayName: 'Base Hover',
    description: 'Base Hover brukes som hover farge på elementer som bruker Base Default fargen.',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
  },
  'base-active': {
    number: 14,
    name: 'base-active',
    group: 'base',
    displayName: 'Base Active',
    description: 'Base Active brukes som active farge på elementer som bruker Base Default fargen.',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
  },
  'base-contrast-subtle': {
    number: 15,
    name: 'base-contrast-subtle',
    group: 'base',
    displayName: 'Contrast Subtle',
    description: 'Contrast Subtle brukes som en viktig meningsbærende farge oppå Base Default fargen.',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
  },
  'base-contrast-default': {
    number: 16,
    name: 'base-contrast-default',
    group: 'base',
    displayName: 'Contrast Default',
    description: 'Contrast Default brukes som en viktig meningsbærende farge oppå alle Base fargane.',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
  },
};

export const colorMetadataByNumber = Object.entries(colorMetadata).reduce((acc, [, metadata]) => {
  R.assoc(metadata.number, metadata, acc);
  return acc;
}, {} as ColorMetadataByNumber);
