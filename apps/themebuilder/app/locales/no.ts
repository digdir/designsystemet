import no from '@internal/components/src/_locales/no';
import themeModal from './no/theme-modal';

export default {
  ...no,
  navigation: {
    fundamentals: 'Grunnleggende',
    'best-practices': 'God praksis',
    patterns: 'Mønstre',
    blog: 'Bloggen',
    components: 'Komponenter',
    'theme-builder': 'Temabygger',
  },
  errors: {
    default: {
      title: 'Oops!',
      details: 'En uventet feil oppstod.',
    },
    '404': {
      title: 'Beklager, vi fant ikke siden',
      details:
        'Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.',
    },
    generic: {
      title: 'Feil',
      'go-to-homepage': 'Gå til forsiden',
    },
  },
  accessibility: {
    'skip-link': 'Hopp til hovedinnhold',
  },
  meta: {
    title: 'Temabygger',
    description: 'Bygg ditt eget tema med Designsystemet',
  },
  themeBuilder: {
    title: 'Temabygger',
    intro: 'Designsystemet sin temabygger',
    heading: 'Sett i gang med å bygge ditt',
    'heading-highlight': 'eget tema',
    description:
      'Skal du ta i bruk Designsystemet i din egen organisasjon med dine egne profilfarger og preferanser? Temabyggeren hjelper deg i gang.',
    'build-theme': 'Bygg tema',
    documentation: 'Dokumentasjon',
  },
  tabs: {
    overview: 'Oversikt',
    colorsystem: 'Fargesystem',
    colors: 'Farger',
    dimensions: 'Dimensjoner',
  },
  colorPreview: {
    title: 'Se fargene dine i bruk',
    description:
      'Hver farge som blir valgt med verktøyet får sitt eget kort i seksjonen til høyre slik at du kan se hvordan fargene harmonerer sammen.',
    note: 'Merk at kontrastfargen inne i knappen endrer seg fra hvit til svart, avhengig av om den valgte fargen er lys eller mørk for å oppnå best mulig kontrast.',
    view: 'Visning:',
    light: 'Lys',
    dark: 'Mørk',
    'example-heading': 'Farger gjør livet mer fargerikt',
    checkbox: 'Checkbox',
    switch: 'Switch',
    primary: 'Primær',
    secondary: 'Sekundær',
  },
  overview: {
    'login-title': 'Logg inn i portalen',
    name: 'Navn',
    password: 'Passord',
    'forgot-password': 'Glemt passord?',
    login: 'Logg inn',
    'device-type': 'Enhetstype:',
    mobile: 'Mobil',
    tablet: 'Tablet',
    computer: 'Datamaskin',
    tv: 'TV',
    sports: 'Sport',
    news: 'Nyheter',
    'news-title': 'Reiste alene til storbyen',
    'news-description': 'Mona kvist ville finne drømmen i New York City',
    articles: 'Artikler',
    contact: 'Kontakt',
    search: 'Søk',
    menu: 'Meny',
    subheading: 'Here is a sub heading',
    'read-more': 'Les mer',
    'people-you-may-know': 'Folk du kanskje kjenner',
    follow: 'Følg',
    'all-users': 'Alle brukere',
    'select-action': 'Velg handling',
    duplicate: 'Dupliser',
    delete: 'Slett',
    update: 'Oppdater',
    execute: 'Utfør',
    'search-user': 'Søk etter bruker',
    email: 'Epost',
    phone: 'Telefon',
    settings: 'Innstillinger',
    'admin-display': 'Her kan du administrere visning',
    'dark-mode': 'Mørk modus',
    'display-mode': 'Visnigsmodus',
  },
  themeModal,
  examples: {
    'example-1': 'Eksempel 1',
    'example-2': 'Eksempel 2',
  },
  colorPane: {
    'main-color': 'main-farge',
    'support-color': 'support-farge',
    add: 'Legg til',
    'edit-color': 'Rediger farge',
    save: 'Lagre',
    cancel: 'Avbryt',
    'remove-color': 'Fjern farge',
    'neutral-info': 'Neutral fargen kan ikke fjernes eller endres navn på.',
    'severity-info': 'Severity fargen kan ikke fjernes eller endres navn på.',
    name: 'Navn',
    'name-placeholder': 'Skriv navnet her...',
    'name-description': 'Bruk kun bokstavene a-z, tall og bindestrek',
    'name-empty-error': 'Navnet på fargen kan ikke være tomt',
    'name-reserved-error':
      'Navnet på fargen kan ikke være det samme som våre systemfarger',
    color: 'Farge',
  },
  appearanceToggle: {
    light: 'Lys',
    dark: 'Mørk',
    'set-to': 'Sett til',
    view: 'visning',
  },
  colorContrasts: {
    title: 'Kontraster mellom farger',
    description:
      'Her vises kontrastene mellom de ulike trinnene i fargeskalaene, samt om fargene oppfyller WCAG-kravene.',
    'aaa-description':
      'Tekst og bakgrunn må ha en kontrast på minst 7:1 for å oppfylle WCAG AAA-kravet.',
    'aa-description':
      'Tekst og bakgrunn må ha en kontrast på minst 4.5:1 for å oppfylle WCAG AA-kravet.',
    'aa18-description':
      'Tekst og bakgrunn må ha en kontrast på minst 3:1 og en skriftstørrelse på 18 px eller større for å oppfylle WCAG AA-kravet.',
    'deco-description':
      'Oppfyller ingen kontrastkrav i WCAG og bør kun brukes til dekorative formål.',
    'text-vs-background': 'Text og Border mot Background og Surface',
    'text-vs-background-desc':
      'Når du bytter mellom fargeskalaene, vil du se at kontrastene mellom fargene i seksjonen nedenfor er nesten identiske. Dette gjør at du kun trenger å vurdere kontrastene for én fargeskala for å forstå hvordan alle fungerer. Siden kontrastene er konsistente, kan du også kombinere ulike farger på tvers av skalaene.',
    'base-colors': 'Base fargene',
    'base-colors-description':
      'Fargene som blir valgt i verktøyet får tokenet Base Default i hver fargeskala. Dette betyr at det er viktig å velge en farge som har over 3:1 kontrast mot overflatefarger om den skal brukes som en viktig, meningsbærende farge. Verktøyet lager også to kontrastfarger som trygt kan brukes oppå base fargene. Disse kontrastfargene blir enten lyse eller mørke avhengig av base fargen.',
    'select-color': 'Velg farge for å se kontraster',
  },
  borderRadius: {
    suggested: 'Foreslått basis Border radius',
    manual: 'Manuell basis Border radius',
    'define-value': 'Definer basisverdien for border-radius',
    none: 'Ingen',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    full: 'Full',
  },
};
