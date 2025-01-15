'use client';
import cl from 'clsx/lite';
import {
  BorderRadius,
  ColorContrasts,
  ColorPreview,
  ColorTokens,
  Colors,
  Header,
  Sidebar,
} from '../../components';
import { useThemeStore } from '../../store';
import { useThemeParams } from './_utils/useThemeParams';
import classes from './page.module.css';

export default function Home() {
  const themeTab = useThemeStore((state) => state.themeTab);
  const appearance = useThemeStore((state) => state.appearance);

  /* For theme params */
  useThemeParams();

  return (
    <div className={classes.page} id='preview'>
      <Header />
      <div className={classes.container}>
        <div className={classes.content}>
          {themeTab === 'overview' && (
            <div className={classes.panel} data-color-scheme={appearance}>
              <BorderRadius />
            </div>
          )}

          {themeTab === 'colorsystem' && (
            <>
              <div
                className={cl(classes.panel, classes.colorsContainer)}
                data-color-scheme={appearance}
              >
                <Colors />
              </div>

              <div className={classes.panel} data-color-scheme={appearance}>
                <ColorPreview />
              </div>
              <div className={classes.panel} data-color-scheme={appearance}>
                <ColorTokens />
              </div>

              <div className={classes.panel} data-color-scheme={appearance}>
                <ColorContrasts />
              </div>
            </>
          )}
        </div>
        <div className={classes.sideBarContainer}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
