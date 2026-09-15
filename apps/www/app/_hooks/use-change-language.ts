import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useChangeLanguage(locale?: string) {
  const { i18n } = useTranslation();
  useEffect(() => {
    if (locale && i18n.language !== locale) i18n.changeLanguage(locale);
  }, [locale, i18n]);
}
