import i18next from 'i18next';
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { HydratedRouter } from 'react-router/dom';
import { getInitialNamespaces } from 'remix-i18next/client';

async function main() {
  await i18next.use(initReactI18next).init({
    fallbackLng: 'no',
    ns: getInitialNamespaces(),
    resources: {
      en: {
        translation: (await import('~/locales/en')).default,
      },
      no: {
        translation: (await import('~/locales/no')).default,
      },
    },
    detection: { order: ['htmlTag'], caches: [] },
  });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

main().catch((error) => console.error(error));
