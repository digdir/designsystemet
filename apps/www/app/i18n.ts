import en from '~/locales/en';
import no from '~/locales/no';

export default {
  // This is the list of languages your application supports
  supportedLngs: ['en', 'no'],
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: 'no',
  // The default namespace of i18next is "translation", but you can customize it here
  resources: {
    en,
    no,
  },
};
