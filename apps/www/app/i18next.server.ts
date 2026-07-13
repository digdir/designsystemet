import { createInstance } from 'i18next';
import i18n from './i18n';
import en from './locales/en';
import no from './locales/no';

const instance = createInstance({
  ...i18n,
  resources: {
    en: {
      translation: en,
    },
    no: {
      translation: no,
    },
  },
});

const ready = instance.init();

export async function getFixedT(lang: string) {
  await ready;
  return instance.getFixedT(lang);
}

export default { getFixedT };
