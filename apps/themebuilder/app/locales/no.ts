import no from '@internal/components/src/_locales/no';
import colorModal from './no/color-modal';
import themeModal from './no/theme-modal';

export default {
  ...no,
  navigation: {
    intro: 'Intro',
    fundamentals: 'Kom i gang',
    'best-practices': 'God praksis',
    patterns: 'Mønstre',
    blog: 'Blogg',
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
    'active-theme': 'Tema',
    'toggle-editor': 'Åpne eller lukke temaredigering',
    'edit-themes': 'Rediger temaer',
    'theme-names': 'Temanavn',
    'remove-theme': 'Slett tema {{name}}',
    'add-theme': 'Legg til tema',
    'theme-name': 'Temanavn',
    'invalid-theme-name':
      'Bruk små bokstaver, tall og bindestreker mellom ord.',
    'duplicate-theme-name': 'Et tema med dette navnet finnes allerede.',
    'documentation-link': 'Les dokumentasjon om eget tema',
  },
  configPaste: {
    title: 'Importer fra konfigurasjonsfil',
    description:
      'Har du allerede en konfigurasjonsfil? Lim den inn her for å velge og redigere et tema.',
    placeholder: 'Lim inn innholdet fra designsystemet.config.json her...',
    validate: 'Valider konfigurasjon',
    'select-theme': 'Velg et tema å redigere',
    'validation-error': 'Ugyldig konfigurasjonsfil',
    'validation-success': 'Konfigurasjonen er gyldig! Velg et tema nedenfor.',
    'no-themes': 'Ingen temaer funnet i konfigurasjonen',
    'edit-theme': 'Rediger tema',
    'import-config': 'Importer config',
  },
  tabs: {
    examples: 'Eksempler',
    colorsystem: 'Fargesystem',
    colors: 'Farger',
    dimensions: 'Dimensjoner',
    variables: 'Variabler',
  },
  colorPreview: {
    title: 'Se fargene dine i bruk',
    description:
      'Hver farge som blir valgt med verktøyet får sitt eget kort i seksjonen til høyre slik at du kan se hvordan fargene harmonerer sammen.',
    note: 'Merk at kontrastfargen inne i knappen endrer seg fra hvit til svart, avhengig av om den valgte fargen er lys eller mørk for å oppnå best mulig kontrast.',
    view: 'Visning:',
    'example-heading': 'Farger gjør livet mer fargerikt',
    checkbox: 'Checkbox',
    switch: 'Switch',
    primary: 'Primær',
    secondary: 'Sekundær',
    grid: 'Rutenett',
    list: 'Liste',
  },
  overview: {
    'login-title': 'Logg inn i portalen',
    name: 'Navn',
    password: 'Passord',
    'forgot-password': 'Glemt passord?',
    login: 'Logg inn',
    mobile: 'Mobil',
    tablet: 'Tablet',
    computer: 'Datamaskin',
    tv: 'TV',
    sports: 'Sport',
    news: 'Nyheter',
    'news-title': 'Reiste alene til storbyen',
    'news-description': 'Mona kvist ville finne drømmen i New York City',
    search: 'Søk',
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
    'display-mode': 'Visningsmodus',
    'select-color': 'Velg farge',
  },
  'color-modal': colorModal,
  themeModal,
  colorPane: {
    'token-overrides': 'Tokenoverstyringer',
    'confirm-add-title': 'Legg til en farge i alle temaer?',
    'confirm-add-description':
      'Dette legger til en farge med samme startverdi i alle {{count}} temaer. Hvert tema kan deretter ha sin egen fargeverdi.',
    'confirm-add': 'Legg til i alle temaer',
    'confirm-remove-title': 'Slett en farge fra alle temaer?',
    'confirm-remove-description':
      'Dette sletter «{{name}}» og dens tokenoverstyringer fra alle {{count}} temaer. Dette kan ikke angres.',
    'confirm-remove': 'Slett fra alle temaer',
    'confirm-rename-title': 'Endre fargenavn i alle temaer?',
    'confirm-rename-description':
      'Dette endrer navnet fra «{{from}}» til «{{to}}» i alle {{count}} temaer, inkludert tokenoverstyringene. Eksisterende fargeverdier beholdes.',
    'confirm-rename': 'Endre navn i alle temaer',
    'name-duplicate-error': 'En farge med dette navnet finnes allerede',
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
    label: 'Utseende',
    light: 'Lys',
    dark: 'Mørk',
    'set-to': 'Sett til',
    view: 'visning',
  },
  colorGroup: {
    'see-more': 'Se mer om {{namespace}} {{color}}',
  },
  'color-tokens': {
    title: 'Fargetokens',
    description:
      'Her ser du hvilke tokens som er brukt for å lage kortene i seksjonen over.',
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
    label: 'Hjørneavrunding',
    suggested: 'Foreslått hjørneavrunding',
    manual: 'Manuell hjørneavrunding',
    'define-value': 'Definer basisverdien for hjørneavrunding',
    none: 'Ingen',
    small: 'Liten',
    medium: 'Middels',
    large: 'Stor',
    full: 'Maksimal',
  },
  overrides: {
    heading: 'Fargeoverstyringer',
    description:
      'Overstyr spesifikke tokenfarger for lys og mørk modus. Sørg for å sjekke kontraster etter endringer.',
  },
};
