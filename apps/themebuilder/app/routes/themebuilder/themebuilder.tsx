import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
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
  Select,
  Textfield,
  Tooltip,
} from '@digdir/designsystemet-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  parsePath,
  redirect,
  useLoaderData,
  useSearchParams,
} from 'react-router';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import {
  addWorkspaceTheme,
  editorParams,
  readWorkspace,
  type ThemeWorkspace,
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

  const severityEnabled = urlParams.get('severity-enabled') === 'true';

  return {
    workspace,
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
  const { workspace, colors, severityColors, overrides, baseBorderRadius } =
    useLoaderData<typeof loader>();
  const [, setParams] = useSearchParams();
  const { t } = useTranslation();
  const newThemeDialog = useRef<HTMLDialogElement>(null);
  const [themeName, setThemeName] = useState('');
  const [themeError, setThemeError] = useState('');
  const themeNames = workspace
    ? Object.keys(workspace.config.themes)
    : ['theme'];

  const addTheme = () => {
    const name = themeName.trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      setThemeError(t('themeBuilder.invalid-theme-name'));
      return;
    }
    if (themeNames.includes(name)) {
      setThemeError(t('themeBuilder.duplicate-theme-name'));
      return;
    }
    const current: ThemeWorkspace = workspace || {
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
    const added = addWorkspaceTheme(current, name);
    setParams((previous) => workspaceParams(added, previous), {
      preventScrollReset: true,
    });
    newThemeDialog.current?.close();
  };
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
                  <Tooltip content={t('themeBuilder.add-theme')}>
                    <Button
                      variant='secondary'
                      icon
                      aria-label={t('themeBuilder.add-theme')}
                      onClick={() => {
                        setThemeName('');
                        setThemeError('');
                        newThemeDialog.current?.showModal();
                      }}
                    >
                      <PlusIcon aria-hidden />
                    </Button>
                  </Tooltip>
                </div>
              </Field>
              <AppearanceToggle />
            </div>
            <ThemePages />
          </div>
        </div>
      </main>
      <Dialog
        ref={newThemeDialog}
        closedby='any'
        aria-labelledby='new-theme-heading'
      >
        <Dialog.Block>
          <Heading id='new-theme-heading' level={2} data-size='sm'>
            {t('themeBuilder.add-theme')}
          </Heading>
        </Dialog.Block>
        <Dialog.Block>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addTheme();
            }}
          >
            <Textfield
              label={t('themeBuilder.theme-name')}
              value={themeName}
              onChange={(event) => {
                setThemeName(event.currentTarget.value);
                setThemeError('');
              }}
              error={themeError || undefined}
              autoFocus
            />
            <div className={classes.dialogActions}>
              <Button
                type='button'
                variant='secondary'
                onClick={() => newThemeDialog.current?.close()}
              >
                {t('colorPane.cancel')}
              </Button>
              <Button type='submit'>
                <PlusIcon aria-hidden />
                {t('themeBuilder.add-theme')}
              </Button>
            </div>
          </form>
        </Dialog.Block>
      </Dialog>
    </ColorModalProvider>
  );
}
