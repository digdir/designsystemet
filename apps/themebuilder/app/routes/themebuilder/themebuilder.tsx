import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
import { ColorModalProvider } from '~/_utils/color-modal-context';
import { ThemePages } from './_components/theme-pages';
import { useThemeParams } from './_utils/useThemeParams';
import classes from './page.module.css';
import 'react-color-palette/css';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import type { Route } from './+types/themebuilder';

export const loader = async ({ params: { lang } }: Route.ComponentProps) => {
  const t = await i18n.getFixedT(lang);

  return {
    lang,
    metadata: generateMetadata({
      title: t('home.title'),
      description: t('home.description'),
    }),
  };
};

export const meta: Route.MetaFunction = ({
  data: { metadata },
}: Route.MetaArgs) => {
  return metadata;
};

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
