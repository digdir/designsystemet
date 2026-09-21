/**
 * Translations for the color metadata we get from `@digdir/designsystemet/color`.
 *
 * The keys map to the semantic color names in `semanticColorSpec`.
 */
export default {
  'background-default': {
    long: 'Background Default er den mest nøytrale bakgrunnsfargen.',
    short: 'Standard bakgrunnsfarge.',
  },
  'background-tinted': {
    long: 'Background Tinted er en bakgrunnsfarge som har et hint av farge i seg.',
    short: 'Bakgrunn med et hint av farge i seg.',
  },
  'surface-default': {
    long: 'Surface Default brukes på flater som ligger oppå bakgrunnsfargene. Dette er den mest nøytrale surface fargen.',
    short: 'Standardfarge for overflater / komponenter.',
  },
  'surface-tinted': {
    long: 'Surface Tinted brukes på flater som ligger oppå bakgrunnsfargene. Denne har et hint av farge i seg.',
    short: 'Overflater / komponenter med et hint av farge i seg.',
  },
  'surface-hover': {
    long: 'Surface Hover brukes på interaktive flater som ligger oppå bakgrunnsfargene i en hover state.',
    short: 'Hover-farge til overflater / komponenter.',
  },
  'surface-active': {
    long: 'Surface Active brukes på interaktive flater som ligger oppå bakgrunnsfargene i en active state.',
    short: 'Active-farge til overflater / komponenter.',
  },
  'border-subtle': {
    long: 'Border Subtle er den lyseste border-fargen og brukes for å skille elementer fra hverandre.',
    short: 'Border-farge med lav kontrast til dekorativ bruk (skillelinjer).',
  },
  'border-default': {
    long: 'Border Default er en border-farge som brukes når man ønsker god kontrast mot bakgrunnsfargene.',
    short:
      'Standard border-farge til skjemakomponenter og meningsbærende elementer.',
  },
  'border-strong': {
    long: 'Border Strong er den mørkeste border-fargen og brukes når man ønsker en veldig tydelig og sterk border.',
    short: 'Border-farge med høy kontrast for ekstra synlighet.',
  },
  'text-subtle': {
    long: 'Text Subtle er den lyseste tekstfargen og brukes på tekst som skal være litt mindre synlig eller for å skape variasjon i typografien.',
    short: 'Tekst- og ikonfarge med lavere kontrast.',
  },
  'text-default': {
    long: 'Text Default er den mørkeste tekstfargen og brukes på tekst som skal være mest synlig. Denne fargen bør brukes på mesteparten av teksten på en side.',
    short: 'Tekst- og ikonfarge med høy kontrast og god synlighet.',
  },
  'base-default': {
    long: 'Base Default fargen får den samme hex koden som fargen som er valgt i verktøyet. Brukes ofte som farge på viktige elementer og på flater som skal fange brukerens oppmerksomhet.',
    short: 'Standardfarge for solide bakgrunner.',
  },
  'base-hover': {
    long: 'Base Hover brukes som hover farge på elementer som bruker Base Default fargen.',
    short: 'Hover-farge for solide bakgrunner.',
  },
  'base-active': {
    long: 'Base Active brukes som active farge på elementer som bruker Base Default fargen.',
    short: 'Active-farge for solide bakgrunner.',
  },
  'base-contrast-subtle': {
    long: 'Contrast Subtle brukes som en viktig meningsbærende farge oppå Base Default fargen.',
    short: 'Farge med god kontrast mot Base-default.',
  },
  'base-contrast-default': {
    long: 'Contrast Default brukes som en viktig meningsbærende farge oppå alle Base fargene.',
    short: 'Farge med god kontrast mot Base-default og Base-hover.',
  },
};
