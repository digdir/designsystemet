import en from '~/locales/en';
import no from '~/locales/no';

/** The i18next options shared by the server, the browser and the loaders */
export default {
  supportedLngs: ['en', 'no'],
  fallbackLng: 'no',
  resources: {
    en: { translation: en },
    no: { translation: no },
  },
};

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en;
    };
  }
}
