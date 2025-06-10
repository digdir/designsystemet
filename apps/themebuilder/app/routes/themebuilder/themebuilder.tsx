import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
import { ColorModalProvider } from '~/_utils/color-modal-context';
import { ThemePages } from './_components/theme-pages';
import { useThemeParams } from './_utils/useThemeParams';
import classes from './page.module.css';
import 'react-color-palette/css';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import type { Route } from './+types/themebuilder';

export const loader = async ({ params: { lang } }: Route.ComponentProps) => {
  const t = await i18n.getFixedT(lang);

  return {
    lang,
    metadata: generateMetadata({
      title: t('meta.title'),
      description: t('meta.description'),
    }),
    isProduction: isProduction(),
  };
};

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  if (!data?.metadata)
    return [
      {
        title: 'Theme Builder',
        description: 'Build your own theme for Designsystemet',
      },
    ];
  return data.metadata;
};

export default function Page() {
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
