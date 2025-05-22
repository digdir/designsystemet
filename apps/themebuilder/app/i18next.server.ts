import { RemixI18Next } from 'remix-i18next/server';
import i18n from '~/i18n';
import en from '~/locales/en';
import no from '~/locales/no';

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
    findLocale: (request) => {
      const url = new URL(request.url);
      if (url.pathname.includes('/no')) {
        return new Promise((resolve) => resolve('no'));
      }
      return new Promise((resolve) => resolve('en'));
    },
  },
  i18next: {
    ...i18n,
    resources: {
      en: {
        translation: en,
      },
      no: {
        translation: no,
      },
    },
  },
  plugins: [],
});

export default i18next;
