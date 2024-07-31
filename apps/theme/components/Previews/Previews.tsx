import type { Mode } from '@digdir/designsystemet/color';
import cl from 'clsx/lite';
import { useState } from 'react';

import { Components } from './Components/Components';
import { Dashboard } from './Dashboard/Dashboard';
import { Landing } from './Landing/Landing';
import classes from './Previews.module.css';

type previewModeType =
  | 'dashboard'
  | 'landing'
  | 'forms'
  | 'auth'
  | 'components';

type PreviewsProps = {
  themeMode: Mode;
  onThemeModeChange: (themeMode: Mode) => void;
};

export const Previews = ({ themeMode, onThemeModeChange }: PreviewsProps) => {
  const [previewMode, setPreviewMode] = useState<previewModeType>('components');

  return (
    <>
      <div className={classes.toolbar}>
        <div className={classes.menu}>
          <button
            className={cl(
              classes.menuItem,
              'ds-focus',
              previewMode === 'components' && classes.menuItemActive,
            )}
            onClick={() => setPreviewMode('components')}
          >
            Komponenter
          </button>
          <button
            className={cl(
              classes.menuItem,
              'ds-focus',
              previewMode === 'dashboard' && classes.menuItemActive,
            )}
            onClick={() => setPreviewMode('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={cl(
              classes.menuItem,
              'ds-focus',
              previewMode === 'landing' && classes.menuItemActive,
              classes.menuItemDisabled,
            )}
            aria-disabled
          >
            Landingsside
          </button>
          <button
            className={cl(
              classes.menuItem,
              'ds-focus',
              previewMode === 'forms' && classes.menuItemActive,
              classes.menuItemDisabled,
            )}
            aria-disabled
          >
            Skjemaer
          </button>
          <button
            className={cl(
              classes.menuItem,
              'ds-focus',
              previewMode === 'auth' && classes.menuItemActive,
              classes.menuItemDisabled,
            )}
            aria-disabled
          >
            Autentisering
          </button>
        </div>
        <div className={classes.toggles}>
          <button
            className={cl(
              classes.toggle,
              'ds-focus',
              themeMode === 'light' && classes.active,
            )}
            onClick={() => onThemeModeChange('light')}
          >
            <img src='img/light-dot.svg' alt='' />
            Lys
          </button>
          <button
            className={cl(
              classes.toggle,
              'ds-focus',
              themeMode === 'dark' && classes.active,
            )}
            onClick={() => onThemeModeChange('dark')}
          >
            <img src='img/dark-dot.svg' alt='' />
            Mørk
          </button>
          <button
            className={cl(
              classes.toggle,
              'ds-focus',
              themeMode === 'contrast' && classes.active,
            )}
            onClick={() => onThemeModeChange('contrast')}
          >
            <img src='img/contrast-dot.svg' alt='' />
            Kontrast
          </button>
        </div>
      </div>

      <div
        className={cl(
          classes.preview,
          classes[themeMode as keyof typeof classes],
        )}
        id='preview'
        data-ds-color-mode={themeMode}
      >
        {previewMode === 'components' && <Components />}
        {previewMode === 'dashboard' && <Dashboard />}
        {previewMode === 'landing' && <Landing />}
      </div>
    </>
  );
};
