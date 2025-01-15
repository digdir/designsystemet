'use client';
import { Sidebar, ThemeHeader } from '../../components';
import { ThemePages } from './_components/ThemePages';
import { useThemeParams } from './_utils/useThemeParams';
import classes from './page.module.css';

export default function Page() {
  /* For theme params */
  useThemeParams();

  return (
    <div className={classes.page} id='preview'>
      <ThemeHeader />
      <div className={classes.container}>
        <div className={classes.content}>
          <ThemePages />
        </div>
        <div className={classes.sideBarContainer}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
