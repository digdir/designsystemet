import type { CssColor, GlobalColors } from './types.js';

export const baseColors: Record<GlobalColors, CssColor> = {
  blue: '#0A71C0',
  green: '#068718',
  orange: '#EA9B1B',
  purple: '#663299',
  red: '#C01B1B',
};

export const colorMetadata = {
  1: {
    name: 'backgroundDefault',
    displayName: 'Background Default',
    description: 'Background Default er den mest nøytrale bakgrunnsfargen.',
    group: 'background',
    luminance: {
      light: 1,
      dark: 0.011,
      contrast: 0.001,
    },
  },
  2: {
    name: 'backgroundTinted',
    displayName: 'Background Tinted',
    group: 'background',
    luminance: {
      light: 0.9,
      dark: 0.017,
      contrast: 0.0065,
    },
    description: 'Background Tinted er en bakgrunnsfarge som har et hint av farge i seg.',
  },
  3: {
    name: 'surfaceDefault',
    displayName: 'Surface Default',
    group: 'surface',
    luminance: {
      light: 1,
      dark: 0.025,
      contrast: 0.015,
    },
    description:
      'Surface Default brukes på flater som ligger oppå bakgrunnsfargene. Dette er den mest nøytrale surface fargen.',
  },
  4: {
    name: 'surfaceTinted',
    displayName: 'Surface Tinted',
    group: 'surface',
    luminance: {
      light: 0.81,
      dark: 0.035,
      contrast: 0.015,
    },
    description: 'Surface Tinted brukes på flater som ligger oppå bakgrunnsfargene. Denne har et hint av farge i seg.',
  },
  5: {
    name: 'surfaceHover',
    displayName: 'Surface Hover',
    group: 'surface',
    luminance: {
      light: 0.7,
      dark: 0.044,
      contrast: 0.028,
    },
    description: 'Surface Hover brukes på interaktive flater som ligger oppå bakgrunnsfargene i en hover state.',
  },
  6: {
    name: 'surfaceActive',
    displayName: 'Surface Active',
    group: 'surface',
    luminance: {
      light: 0.6,
      dark: 0.057,
      contrast: 0.045,
    },
    description: 'Surface Active brukes på interaktive flater som ligger oppå bakgrunnsfargene i en active state.',
  },
  7: {
    name: 'borderSubtle',
    displayName: 'Border Subtle',
    group: 'border',
    luminance: {
      light: 0.5,
      dark: 0.082,
      contrast: 0.26,
    },
    description: 'Border Subtle er den lyseste border-fargen og brukes for å skille elementer fra hverandre.',
  },
  8: {
    name: 'borderDefault',
    displayName: 'Border Default',
    group: 'border',
    luminance: {
      light: 0.21,
      dark: 0.2,
      contrast: 0.4,
    },
    description: 'Border Default er en border-farge som brukes når man ønsker god kontrast mot bakgrunnsfargene.',
  },
  9: {
    name: 'borderStrong',
    displayName: 'Border Strong',
    group: 'border',
    luminance: {
      light: 0.12,
      dark: 0.36,
      contrast: 0.6,
    },
    description:
      'Border Strong er den mørkeste border-fargen og brukes når man ønsker en veldig tydelig og sterk border.',
  },
  10: {
    name: 'textSubtle',
    displayName: 'Text Subtle',
    group: 'text',
    luminance: {
      light: 0.12,
      dark: 0.36,
      contrast: 0.57,
    },
    description:
      'Text Subtle er den lyseste tekstfargen og brukes på tekst som skal være litt mindre synlig eller for å skape variasjon i typografien.',
  },
  11: {
    name: 'textDefault',
    displayName: 'Text Default',
    group: 'text',
    luminance: {
      light: 0.0245,
      dark: 0.78,
      contrast: 0.86,
    },
    description:
      'Text Default er den mørkeste tekstfargen og brukes på tekst som skal være mest synlig. Denne fargen bør brukes på mesteparten av teksten på en side.',
  },
  12: {
    name: 'baseDefault',
    displayName: 'Base Default',
    group: 'base',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
    description:
      'Base Default fargen får den samme hex koden som fargen som er valgt i verktøyet. Brukes ofte som farge på viktige elementer og på flater som skal fange brukerens oppmerksomhet.',
  },
  13: {
    name: 'baseHover',
    displayName: 'Base Hover',
    group: 'base',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
    description: 'Base Hover brukes som hover farge på elementer som bruker Base Default fargen.',
  },
  14: {
    name: 'baseActive',
    displayName: 'Base Active',
    group: 'base',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
    description: 'Base Active brukes som active farge på elementer som bruker Base Default fargen.',
  },
  15: {
    name: 'contrastSubtle',
    displayName: 'Contrast Subtle',
    group: 'base',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
    description: 'Contrast Subtle brukes som en viktig meningsbærende farge oppå Base Default fargen.',
  },
  16: {
    name: 'contrastDefault',
    displayName: 'Contrast Default',
    group: 'base',
    luminance: {
      light: 1,
      dark: 1,
      contrast: 1,
    },
    description: 'Contrast Default brukes som en viktig meningsbærende farge oppå alle Base fargane.',
  },
} as const;
