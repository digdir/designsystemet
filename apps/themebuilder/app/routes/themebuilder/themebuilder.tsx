import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
import { ColorModalProvider } from '~/_utils/color-modal-context';
import { ThemePages } from '../../layouts/themebuilder/layout';
import classes from './page.module.css';
import 'react-color-palette/css';
import type { ColorScheme } from '@digdir/designsystemet';
import { parsePath, redirect } from 'react-router';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import themeConfig from '../../../../../designsystemet.config.json';
import {
  applyOverridesToColors,
  createColorsFromQuery,
  createSeverityColorsFromQuery,
  parseColorOverrides,
  QUERY_SEPARATOR,
  type SeverityColorTheme,
} from './_utils/use-themebuilder';
import type { Route } from './+types/themebuilder';

const toQueryString = (obj: Record<string, string>) =>
  Object.entries(obj)
    .map(([key, value]) => `${key}:${value}`)
    .join(QUERY_SEPARATOR);
const THEME = themeConfig.themes.designsystemet.colors;
const COLORS = toQueryString(THEME);

export type ThemebuilderTabs = 'examples' | 'colorsystem' | 'variables';

const DEFAULT_TAB: ThemebuilderTabs = 'colorsystem';

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
      colors: COLORS,
      appearance: 'light',
      'border-radius': '4',
      tab: DEFAULT_TAB,
    });

    return redirect(`/${lang}/themebuilder?${newParams.toString()}`);
  }

  if (urlParams.get('tab') === 'overview') {
    urlParams.set('tab', 'examples' as ThemebuilderTabs);
    return redirect(`/${lang}/themebuilder?${urlParams.toString()}`);
  }

  /* Backwards compatibility: merge legacy `main`, `support` and `neutral`
   * params into the single `colors` param and redirect to normalize the URL. */
  if (
    !urlParams.has('colors') &&
    (urlParams.has('main') ||
      urlParams.has('support') ||
      urlParams.has('neutral'))
  ) {
    const legacyColors = [
      urlParams.get('main'),
      urlParams.get('support'),
      urlParams.get('neutral') ? `neutral:${urlParams.get('neutral')}` : null,
    ]
      .filter(Boolean)
      .join(QUERY_SEPARATOR);

    urlParams.delete('main');
    urlParams.delete('support');
    urlParams.delete('neutral');
    urlParams.set('colors', legacyColors);

    return redirect(`/${lang}/themebuilder?${urlParams.toString()}`);
  }

  const colors = createColorsFromQuery(urlParams.get('colors') || COLORS);

  // Parse and apply color overrides
  const overridesParam = urlParams.get('color-overrides');
  const overridesMap = parseColorOverrides(overridesParam);

  const colorsWithOverrides = applyOverridesToColors(colors, overridesMap);

  const severityColors = createSeverityColorsFromQuery(
    urlParams.get('severity'),
  );

  const severityEnabled = urlParams.get('severity-enabled') === 'true';

  return {
    colors: colorsWithOverrides,
    severityColors: applyOverridesToColors(
      severityColors,
      overridesMap,
    ) as SeverityColorTheme[],
    severityEnabled,
    overrides: overridesMap,
    colorScheme: (urlParams.get('appearance') || 'light') as ColorScheme,
    baseBorderRadius: parseInt(urlParams.get('border-radius') || '4', 10),
    tab: urlParams.get('tab') || DEFAULT_TAB,
    lang,
    metadata: generateMetadata({
      title: t('meta.title'),
      description: t('meta.description'),
    }),
    isProduction: isProduction(),
  };
};

export const meta: Route.MetaFunction = ({ loaderData }: Route.MetaArgs) => {
  if (!loaderData?.metadata)
    return [
      {
        title: 'Theme Builder - Designsystemet',
        description: 'Build your own theme for Designsystemet',
      },
    ];
  return loaderData.metadata;
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
