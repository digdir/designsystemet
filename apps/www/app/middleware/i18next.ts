import { initReactI18next } from 'react-i18next';
import { unstable_createI18nextMiddleware } from 'remix-i18next/middleware';
import en from '~/locales/en';
import no from '~/locales/no';

export const [i18nextMiddleware, getLocale, getInstance] =
  unstable_createI18nextMiddleware({
    detection: {
      supportedLanguages: ['en', 'no'],
      fallbackLanguage: 'no',
      findLocale(request) {
        const locale = request.url.includes('/en/') ? 'en' : 'no';
        return Promise.resolve(locale);
      },
    },
    i18next: {
      resources: { en: { translation: en }, no: { translation: no } },
    },
    plugins: [initReactI18next],
  });

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en;
    };
  }
}
