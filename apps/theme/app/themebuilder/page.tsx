'use client';
import { Sidebar, ThemeHeader } from '../../components';
import { AppearanceToggle } from '../../components/AppearanceToggle/AppearanceToggle';
import { ThemePages } from './_components/ThemePages';
import { useThemeParams } from './_utils/useThemeParams';
import classes from './page.module.css';

export default function Page() {
  /* For theme params */
  useThemeParams();

  return (
    <div className={classes.page} id='main'>
      <ThemeHeader />
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.toolbar}>
            <AppearanceToggle />
          </div>
          <ThemePages />
        </div>
        <div className={classes.sideBarContainer}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
