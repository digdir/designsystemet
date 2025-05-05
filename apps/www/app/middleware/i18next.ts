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
        const locale = request.url.split('/').at(1);
        return Promise.resolve(locale ?? 'no');
      },
    },
    i18next: {
      resources: { en: { translation: en }, no: { translation: no } },
      // Other i18next options are available here
      fallbackLng: 'no',
    },
    plugins: [initReactI18next],
  });
