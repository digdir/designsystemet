/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import cl from 'clsx/lite';

import type { ThemeMode } from '../../utils/themeUtils';

import { Dashboard } from './Dashboard/Dashboard';
import { Landing } from './Landing/Landing';
import classes from './Previews.module.css';
import { Components } from './Components/Components';

type previewModeType =
  | 'dashboard'
  | 'landing'
  | 'forms'
  | 'auth'
  | 'components';

type PreviewsProps = {
  themeMode: ThemeMode;
  onThemeModeChange: (themeMode: ThemeMode) => void;
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
              previewMode === 'components' && classes.menuItemActive,
            )}
            onClick={() => setPreviewMode('components')}
          >
            Komponenter
          </button>
          <button
            className={cl(
              classes.menuItem,
              previewMode === 'dashboard' && classes.menuItemActive,
            )}
            onClick={() => setPreviewMode('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={cl(
              classes.menuItem,
              previewMode === 'landing' && classes.menuItemActive,
              classes.menuItemDisabled,
            )}
          >
            Landingsside
          </button>
          <button
            className={cl(
              classes.menuItem,
              previewMode === 'forms' && classes.menuItemActive,
              classes.menuItemDisabled,
            )}
          >
            Skjemaer
          </button>
          <button
            className={cl(
              classes.menuItem,
              previewMode === 'auth' && classes.menuItemActive,
              classes.menuItemDisabled,
            )}
          >
            Autentisering
          </button>
        </div>
        <div className={classes.toggles}>
          <button
            className={cl(
              classes.toggle,
              themeMode === 'light' && classes.active,
            )}
            onClick={() => onThemeModeChange('light')}
          >
            <img
              src='img/light-dot.svg'
              alt=''
            />
            Lys
          </button>
          <button
            className={cl(
              classes.toggle,
              themeMode === 'dark' && classes.active,
            )}
            onClick={() => onThemeModeChange('dark')}
          >
            <img
              src='img/dark-dot.svg'
              alt=''
            />
            Mørk
          </button>
          <button
            className={cl(
              classes.toggle,
              themeMode === 'contrast' && classes.active,
            )}
            onClick={() => onThemeModeChange('contrast')}
          >
            <img
              src='img/contrast-dot.svg'
              alt=''
            />
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
