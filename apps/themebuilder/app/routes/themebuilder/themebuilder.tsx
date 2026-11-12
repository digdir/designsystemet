import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { EditThemesDialog } from '~/_components/edit-themes-dialog/edit-themes-dialog';
import { ColorModalProvider } from '~/_utils/color-modal-context';
import { ThemePages } from '../../layouts/themebuilder/layout';
import classes from './page.module.css';
import 'react-color-palette/css';
import type { ColorScheme } from '@digdir/designsystemet/internal';
import {
  Button,
  Dialog,
  Field,
  Heading,
  Label,
  Link,
  Select,
  Tabs,
} from '@digdir/designsystemet-react';
import { CircleIcon, PaletteIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  parsePath,
  redirect,
  useLoaderData,
  useRouteLoaderData,
  useSearchParams,
} from 'react-router';
import { BorderRadiusInput } from '~/_components/border-radius-input/border-radius-input';
import { ConfigPaste } from '~/_components/config-paste/config-paste';
import { ColorPage } from '~/_components/sidebar/color-page/color-page';
import { TokenModal } from '~/_components/token-modal/token-modal';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import type { ThemeWorkspace } from '~/_utils/theme-workspace';
import {
  editorParams,
  readWorkspace,
  workspaceParams,
} from '~/_utils/theme-workspace';
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
  let urlParams = new URLSearchParams(search);
  let workspace: ThemeWorkspace | null;
  try {
    workspace = readWorkspace(urlParams);
    urlParams = editorParams(urlParams);
  } catch {
    throw new Response('Invalid theme workspace URL', { status: 400 });
  }

  /* if we have no params, push some default values */
  if (urlParams.toString() === '') {
    const newParams = new URLSearchParams({
      colors: COLORS,
      appearance: 'light',
      'border-radius': '4',
      tab: DEFAULT_TAB,
    });

    return redirect(`/${lang}?${newParams.toString()}`);
  }

  if (urlParams.get('tab') === 'overview') {
    urlParams.set('tab', 'examples' as ThemebuilderTabs);
    return redirect(`/${lang}?${urlParams.toString()}`);
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

    return redirect(`/${lang}?${urlParams.toString()}`);
  }

  const colors = createColorsFromQuery(urlParams.get('colors') || COLORS);

  // Parse and apply color overrides
  const overridesParam = urlParams.get('color-overrides');
  const overridesMap = parseColorOverrides(overridesParam);

  const colorsWithOverrides = applyOverridesToColors(colors, overridesMap);

  const severityColors = createSeverityColorsFromQuery(
    urlParams.get('severity'),
  );

  return {
    workspace,
    colors: colorsWithOverrides,
    severityColors: applyOverridesToColors(
      severityColors,
      overridesMap,
    ) as SeverityColorTheme[],
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
  const { lang } = useRouteLoaderData('themebuilder');
  const { workspace, colors, severityColors, overrides, baseBorderRadius } =
    useLoaderData<typeof loader>();
  const [, setParams] = useSearchParams();
  const { t } = useTranslation();
  const themeNames = workspace
    ? Object.keys(workspace.config.themes)
    : ['theme'];

  /* Without a config in the URL, the editor holds a single theme named `theme` */
  const currentWorkspace: ThemeWorkspace = workspace || {
    activeTheme: 'theme',
    config: {
      themes: {
        theme: {
          colors: Object.fromEntries(
            colors.map((color) => [
              color.name,
              color.hex || color.colors.light['base-default'].hex,
            ]),
          ),
          borderRadius: baseBorderRadius,
          overrides: {
            colors: overrides,
            ...(severityColors.some((color) => !color.isDefault) && {
              severity: Object.fromEntries(
                severityColors
                  .filter((color) => !color.isDefault)
                  .map((color) => [color.name, color.hex]),
              ),
            }),
          },
        },
      },
    },
  };

  const [tab, setTab] = useState('colors');

  return (
    <Tabs className={classes.page} value={tab} onChange={setTab}>
      <header>
        <Link
          aria-label='designsystemet.no'
          href={`https://designsystemet.no/${lang}/`}
          style={{ color: 'inherit' }}
        >
          {''}
        </Link>
        <h1>Tema og variabler</h1>
        <TokenModal />
        <Button
          command='show-modal'
          commandFor='config-paste'
          data-variant='secondary'
        >
          {t('configPaste.import-config')}
        </Button>
        <Dialog id='config-paste' closedby='any'>
          <Heading level={2}>{t('configPaste.import-config')}</Heading>
          <ConfigPaste />
        </Dialog>
      </header>
      <Tabs.List data-size='sm'>
        <Tabs.Tab aria-controls='panel' value='colors'>
          <PaletteIcon />
          {t('tabs.colors')}
        </Tabs.Tab>
        <Tabs.Tab aria-controls='panel' value='border'>
          <CircleIcon />
          Kant
        </Tabs.Tab>
        {/* <Tabs.Tab aria-controls='panel' value='fonts'>
          <FileTextIcon />
          Fonter
        </Tabs.Tab> */}
      </Tabs.List>
      <div role='tabpanel' id='panel'>
        <main id='main'>
          {tab === 'colors' && <ColorPage />}
          {tab === 'border' && <BorderRadiusInput />}
          <div>
            <ColorModalProvider>
              <div className={classes.container}>
                <div className={classes.sideBarContainer}></div>
                <div className={classes.content}>
                  <div className={classes.toolbar}>
                    <div className={classes.themeGroup}>
                      <Field className={classes.themeSelector} data-size='sm'>
                        <Label>{t('themeBuilder.active-theme')}</Label>
                        <div className={classes.themeControls}>
                          <Select
                            value={workspace?.activeTheme || 'theme'}
                            onChange={(event) => {
                              const theme = event.currentTarget.value;
                              setParams(
                                (previous) => {
                                  const next = new URLSearchParams(previous);
                                  next.set('theme', theme);
                                  next.delete('severity-enabled');
                                  return next;
                                },
                                { preventScrollReset: true },
                              );
                            }}
                          >
                            {themeNames.map((name) => (
                              <Select.Option key={name} value={name}>
                                {name}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
                      </Field>
                      <EditThemesDialog
                        workspace={currentWorkspace}
                        onSave={(updated) =>
                          setParams(
                            (previous) => workspaceParams(updated, previous),
                            { preventScrollReset: true },
                          )
                        }
                      />
                    </div>
                    <AppearanceToggle />
                  </div>
                  <ThemePages />
                </div>
              </div>
            </ColorModalProvider>
          </div>
        </main>
      </div>
    </Tabs>
  );
}
