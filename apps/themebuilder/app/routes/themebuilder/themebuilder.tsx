import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
import { ColorModalProvider } from '~/_utils/color-modal-context';
import { ThemePages } from './_components/theme-pages';
import classes from './page.module.css';
import 'react-color-palette/css';
import type { ColorScheme, CssColor } from '@digdir/designsystemet';
import { parsePath, redirect } from 'react-router';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import type { Route } from './+types/themebuilder';
import {
  createColorsAndVariables,
  createColorsFromQuery,
} from './_utils/useThemebuilder';

export const loader = async ({
  params: { lang },
  request,
}: Route.LoaderArgs) => {
  const t = await i18n.getFixedT(lang);

  const { search } = parsePath(request.url);
  const urlParams = new URLSearchParams(search);

  /* if we have no params, push some default values */
  if (urlParams.toString() === '') {
    const newParams = new URLSearchParams({
      main: 'accent:#0062ba',
      neutral: '#1E2B3C',
      support: 'brand1:#F45F63 brand2:#E5AA20 brand3:#1E98F5',
      appearance: 'light',
      'border-radius': '4',
      tab: 'overview',
    });

    return redirect(`/${lang}/themebuilder?${newParams.toString()}`);
  }

  const colors = {
    main: createColorsFromQuery(urlParams.get('main') || 'main:#0062ba') || [],
    neutral: [
      {
        name: 'neutral',
        ...createColorsAndVariables(
          (urlParams.get('neutral') as CssColor) || '#1E2B3C',
        ),
        hex: (urlParams.get('neutral') as CssColor) || '#1E2B3C',
      },
    ],
    support: urlParams.get('support')
      ? createColorsFromQuery(urlParams.get('support') || '') || []
      : [],
  };

  return {
    colors,
    colorScheme: (urlParams.get('appearance') || 'light') as ColorScheme,
    baseBorderRadius: parseInt(urlParams.get('border-radius') || '4'),
    tab: urlParams.get('tab') || 'overview',
    lang,
    metadata: generateMetadata({
      title: t('meta.title'),
      description: t('meta.description'),
    }),
    isProduction: isProduction(),
  };
};

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  if (!data?.metadata)
    return [
      {
        title: 'Theme Builder - Designsystemet',
        description: 'Build your own theme for Designsystemet',
      },
    ];
  return data.metadata;
};

export default function Page() {
  return (
    <ColorModalProvider>
      <ThemeHeader />
      <main className={classes.page} id='main'>
        <div className={classes.container}>
          <div className={classes.sideBarContainer}>
            <Sidebar />
          </div>
          <div className={classes.content}>
            <div className={classes.toolbar}>
              <AppearanceToggle />
            </div>
            <ThemePages />
          </div>
        </div>
      </main>
    </ColorModalProvider>
  );
}
