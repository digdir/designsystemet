import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
import { ColorModalProvider } from '~/_utils/color-modal-context';
import { ThemePages } from './_components/theme-pages';
import { useThemeParams } from './_utils/useThemeParams';
import classes from './page.module.css';
import 'react-color-palette/css';

export default function Page() {
  return (
    <ColorModalProvider>
      <main className={classes.page} id='main'>
        <ThemeHeader />
        <div className={classes.container}>
          <div className={classes.sideBarContainer}>
            <Sidebar />
          </div>
          <div className={classes.content}>
            <div className={classes.toolbar}>
              <AppearanceToggle />
            </div>
            <ThemePages />
          </div>
        </div>
      </main>
      <ParamsComponent />
    </ColorModalProvider>
  );
}

const ParamsComponent = () => {
  useThemeParams();
  return null;
};
