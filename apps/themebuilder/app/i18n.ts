import en from '~/locales/en';
import no from '~/locales/no';

export default {
  supportedLngs: ['en', 'no'],
  fallbackLng: 'no',
  resources: {
    en,
    no,
  },
};

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en;
    };
  }
}
