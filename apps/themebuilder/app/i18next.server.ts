import { createInstance } from 'i18next';
import i18n from '~/i18n';

const instance = createInstance(i18n);
const ready = instance.init();

/** Translations for a loader, which runs outside React */
async function getFixedT(lang: string) {
  await ready;
  return instance.getFixedT(lang);
}

export default { getFixedT };
