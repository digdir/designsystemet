import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
import { ColorModalProvider } from '~/_utils/color-modal-context';
import { ThemePages } from '../../layouts/themebuilder/layout';
import classes from './page.module.css';
import 'react-color-palette/css';
import type { ColorScheme, CssColor } from '@digdir/designsystemet';
import { parsePath, redirect } from 'react-router';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import themeConfig from '../../../../../designsystemet.config.json';
import {
  applyOverridesToColors,
  createColorsAndNeutralVariables,
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
const MAIN_COLORS = toQueryString(THEME.main);
const SUPPORT_COLORS = toQueryString(THEME.support);
const NEUTRAL_COLOR = THEME.neutral;

export type ThemebuilderTabs = 'examples' | 'colorsystem' | 'variables';

const DEFAULT_TAB: ThemebuilderTabs = 'colorsystem';

const getTabUrlParam = (urlParams: URLSearchParams) => {
  const tab = urlParams.get('tab') || DEFAULT_TAB;
  if (tab === 'overview') {
    return DEFAULT_TAB;
  }
  return tab as ThemebuilderTabs;
};

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
      main: MAIN_COLORS,
      neutral: NEUTRAL_COLOR,
      support: SUPPORT_COLORS,
      appearance: 'light',
      'border-radius': '4',
      tab: DEFAULT_TAB,
    });

    return redirect(`/${lang}/themebuilder?${newParams.toString()}`);
  }

  const colors = {
    main: createColorsFromQuery(urlParams.get('main') || MAIN_COLORS) || [],
    neutral: [
      {
        name: 'neutral',
        ...createColorsAndNeutralVariables(
          (urlParams.get('neutral') as CssColor) || NEUTRAL_COLOR,
        ),
        hex: (urlParams.get('neutral') as CssColor) || NEUTRAL_COLOR,
      },
    ],
    support: createColorsFromQuery(urlParams.get('support')),
  };

  // Parse and apply color overrides
  const overridesParam = urlParams.get('color-overrides');
  const overridesMap = parseColorOverrides(overridesParam);

  const colorsWithOverrides = {
    main: applyOverridesToColors(colors.main, overridesMap),
    neutral: applyOverridesToColors(colors.neutral, overridesMap),
    support: applyOverridesToColors(colors.support, overridesMap),
  };

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
    tab: getTabUrlParam(urlParams),
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
