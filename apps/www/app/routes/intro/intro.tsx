import { Paragraph } from '@digdir/designsystemet-react';
import * as Aksel from '@navikt/aksel-icons';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import {
  Banner,
  BannerHeading,
  BannerIngress,
} from '~/_components/banner/banner';
import { FundamentalsCard } from '~/_components/fundamentals-card/fundamentals-card';
import { Grid } from '~/_components/grid/grid';
import { generateMetadata } from '~/_utils/metadata';
import i18nConf from '~/i18n';
import i18n from '~/i18next.server';
import type { Route as LayoutRoute } from '../../layouts/intro/+types/layout';
import type { Route } from './+types/intro';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  if (!i18nConf.supportedLngs.includes(lang)) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const t = await i18n.getFixedT(lang);

  return {
    lang,
    metadata: generateMetadata({
      title: t('intro.title'),
      description: t('intro.description'),
    }),
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data) return [{ title: 'Designsystemet' }];
  return data.metadata;
};

export default function Intro() {
  const { t } = useTranslation();
  const { cats } = useRouteLoaderData(
    'layouts/intro/layout',
  ) as LayoutRoute.ComponentProps['loaderData'];

  return (
    <>
      <Banner
        style={{ marginBottom: 'var(--page-spacing-top)' }}
        data-color='brand2'
        icon={<Aksel.LayersIcon />}
      >
        <BannerHeading level={1}>{t('intro.title')}</BannerHeading>
        <BannerIngress>{t('intro.description')}</BannerIngress>
      </Banner>
      {Object.entries(cats).map(([key, value]) => {
        return (
          <Fragment key={key}>
            <Grid>
              {value.map((item) => {
                const Icon = item.icon
                  ? // biome-ignore lint/performance/noDynamicNamespaceImportAccess: this should be safe because we prerender the page
                    Aksel[item.icon as keyof typeof Aksel]
                  : Aksel.LayersIcon;
                return (
                  <FundamentalsCard
                    key={item.title}
                    title={item.title}
                    url={item.url}
                    color={item.color}
                    description={item.description}
                    icon={<Icon />}
                  />
                );
              })}
            </Grid>
          </Fragment>
        );
      })}
    </>
  );
}
