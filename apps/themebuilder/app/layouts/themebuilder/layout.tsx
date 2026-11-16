import { Field, Label, Select } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { ColorContrasts } from '~/_components/color-contrasts/color-contrasts';
import { ColorModalProvider } from '~/_components/color-modal/color-modal-context';
import { ColorPreview } from '~/_components/color-preview/color-preview';
import { ColorTokens } from '~/_components/color-tokens/color-tokens';
import { Colors } from '~/_components/colors/colors';
import { EditThemesDialog } from '~/_components/edit-themes-dialog/edit-themes-dialog';
import { ExamplesComponents } from '~/_components/examples-components/examples-components';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
import { useThemebuilder } from '~/_hooks/use-themebuilder';
import { useThemeStore } from '~/model/theme-store';
import classes from './layout.module.css';

/** The theme builder page: the header with the tabs, the editor in the sidebar, and the theme shown in the chosen tab */
export const ThemebuilderLayout = () => {
  const { workspace, setWorkspace } = useThemeStore();
  const { t } = useTranslation();

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
            <TabContent />
          </div>
        </div>
      </main>
    </ColorModalProvider>
  );
};

const TabContent = () => {
  const { colorScheme, baseBorderRadius, tab } = useThemebuilder();

  switch (tab) {
    case 'examples':
      return (
        <div className={classes.basicPanel} data-color-scheme={colorScheme}>
          <ExamplesComponents
            colorScheme={colorScheme}
            borderRadius={baseBorderRadius}
          />
        </div>
      );
    case 'colorsystem':
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
    default:
      return null;
  }
};
