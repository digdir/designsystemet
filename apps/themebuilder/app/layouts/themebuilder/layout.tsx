import { Field, Label, Select } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { type ReactNode, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { ColorContrasts } from '~/_components/color-contrasts/color-contrasts';
import { ColorPreview } from '~/_components/color-preview/color-preview';
import { ColorTokens } from '~/_components/color-tokens/color-tokens';
import { Colors } from '~/_components/colors/colors';
import { EditThemesDialog } from '~/_components/edit-themes-dialog/edit-themes-dialog';
import { ExamplesComponents } from '~/_components/examples-components/examples-components';
import { PageHeader } from '~/_components/page-header/page-header';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ViewTabs, viewTabId } from '~/_components/view-tabs/view-tabs';
import { useColorScheme } from '~/_hooks/use-color-scheme';
import { useView, type ViewName } from '~/_hooks/use-view';
import { useThemeStore } from '~/model/theme-store';
import classes from './layout.module.css';

/** The theme builder page: the header with the tabs, the editor in the sidebar, and the theme shown in the chosen view */
export const ThemebuilderLayout = () => {
  const { workspace, setWorkspace } = useThemeStore();
  const { t } = useTranslation();
  const [view, setView] = useView();
  const tabsId = useId();

  /* The views of the theme. The tabs and the content both come from this list. */
  const views: { value: ViewName; label: string; content: ReactNode }[] = [
    {
      value: 'colorsystem',
      label: t('tabs.colorsystem'),
      content: <ColorSystemView />,
    },
    {
      value: 'examples',
      label: t('tabs.examples'),
      content: <ExamplesView />,
    },
  ];

  return (
    <>
      <PageHeader>
        <ViewTabs
          id={tabsId}
          aria-label={t('tabs.label')}
          views={views}
          value={view}
          onChange={setView}
        />
      </PageHeader>
      <main className={classes.page} id='main'>
        <div className={classes.container}>
          <div className={classes.sideBarContainer}>
            <Sidebar />
          </div>
          <div className={classes.content}>
            <div className={classes.toolbar}>
              <div className={classes.themeGroup}>
                <Field className={classes.themeSelector} data-size='sm'>
                  <Label>{t('themeBuilder.active-theme')}</Label>
                  <div className={classes.themeControls}>
                    <Select
                      value={workspace.activeTheme}
                      onChange={(event) => {
                        const activeTheme = event.currentTarget.value;
                        setWorkspace((previous) => ({
                          ...previous,
                          activeTheme,
                        }));
                      }}
                    >
                      {Object.keys(workspace.config.themes).map((name) => (
                        <Select.Option key={name} value={name}>
                          {name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Field>
                <EditThemesDialog workspace={workspace} onSave={setWorkspace} />
              </div>
              <AppearanceToggle />
            </div>
            <div
              role='tabpanel'
              aria-labelledby={viewTabId(tabsId, view)}
              className={classes.view}
            >
              {views.find(({ value }) => value === view)?.content}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const ColorSystemView = () => {
  const [colorScheme] = useColorScheme();

  return (
    <>
      <div
        className={cl(classes.basicPanel, classes.colorsContainer)}
        data-color-scheme={colorScheme}
      >
        <Colors />
      </div>

      <div className={classes.panel} data-color-scheme={colorScheme}>
        <ColorPreview />
      </div>
      <div className={classes.panel} data-color-scheme={colorScheme}>
        <ColorTokens />
      </div>

      <div className={classes.panel} data-color-scheme={colorScheme}>
        <ColorContrasts />
      </div>
    </>
  );
};

const ExamplesView = () => {
  const [colorScheme] = useColorScheme();

  return (
    <div className={classes.basicPanel} data-color-scheme={colorScheme}>
      <ExamplesComponents />
    </div>
  );
};
