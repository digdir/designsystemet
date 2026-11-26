import { Field, Label, Select } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { type ReactNode, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { ColorContrasts } from '~/_components/color-contrasts/color-contrasts';
import { ColorPreview } from '~/_components/color-preview/color-preview';
import { ColorPreviewTokens } from '~/_components/color-preview-tokens/color-preview-tokens';
import { ColorScales } from '~/_components/color-scales/color-scales';
import { EditThemesDialog } from '~/_components/edit-themes-dialog/edit-themes-dialog';
import { Examples } from '~/_components/examples/examples';
import { PageHeader } from '~/_components/page-header/page-header';
import { ShareThemeDialog } from '~/_components/share-theme-dialog/share-theme-dialog';
import { SyncStatus } from '~/_components/share-theme-dialog/sync-status';
import { ThemeEditor } from '~/_components/theme-editor/theme-editor';
import { ViewTabs, viewTabId } from '~/_components/view-tabs/view-tabs';
import { useColorScheme } from '~/_hooks/use-color-scheme';
import { useView, type ViewName } from '~/_hooks/use-view';
import { useThemeStore } from '~/model/theme-store';
import classes from './themebuilder.module.css';

/**
 * The theme builder page: the header with the tabs, the editor in the sidebar, and the theme shown in the chosen view.
 * `canShare` is whether the server can save themes, and so whether a theme can be shared as a link.
 */
export const Themebuilder = ({ canShare }: { canShare: boolean }) => {
  const { workspace, setWorkspace } = useThemeStore();
  const { t } = useTranslation();
  const [view, setView] = useView();
  const tabsId = useId();

  /* The views of the theme. The tabs and the content both come from this list. */
  const views: { value: ViewName; label: string; content: ReactNode }[] = [
    {
      value: 'colorsystem',
      label: t('viewTabs.colorsystem'),
      content: <ColorSystemView />,
    },
    {
      value: 'examples',
      label: t('viewTabs.examples'),
      content: <ExamplesView />,
    },
  ];

  return (
    <>
      <PageHeader>
        <ViewTabs
          id={tabsId}
          aria-label={t('viewTabs.label')}
          views={views}
          value={view}
          onChange={setView}
        />
      </PageHeader>
      <main className={classes.page} id='main'>
        <div className={classes.container}>
          <div className={classes.editor}>
            <ThemeEditor />
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
                {canShare && <ShareThemeDialog />}
              </div>
              <AppearanceToggle />
              <SyncStatus />
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
        className={cl(classes.paddedPanel, classes.scroll)}
        data-color-scheme={colorScheme}
      >
        <ColorScales />
      </div>

      <div className={classes.splitPanel} data-color-scheme={colorScheme}>
        <ColorPreview />
      </div>
      <div className={classes.splitPanel} data-color-scheme={colorScheme}>
        <ColorPreviewTokens />
      </div>

      <div className={classes.splitPanel} data-color-scheme={colorScheme}>
        <ColorContrasts />
      </div>
    </>
  );
};

const ExamplesView = () => {
  const [colorScheme] = useColorScheme();

  return (
    <div className={classes.paddedPanel} data-color-scheme={colorScheme}>
      <Examples />
    </div>
  );
};
