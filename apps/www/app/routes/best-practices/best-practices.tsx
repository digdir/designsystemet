import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { HandShakeHeartIcon } from '@navikt/aksel-icons';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import {
  Banner,
  BannerHeading,
  BannerIngress,
} from '~/_components/banner/banner';
import { Grid } from '~/_components/grid/grid';
import { TeaserCard } from '~/_components/teaser-card/teaser-card';
import { formatDate } from '~/_utils/date';
import { generateMetadata } from '~/_utils/metadata';
import i18nConf from '~/i18n';
import i18n from '~/i18next.server';
import type { Route as LayoutRoute } from '../../layouts/best-practices/+types/layout';
import type { Route } from './+types/best-practices';

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
      title: t('best-practices.title'),
      description: t('best-practices.description'),
    }),
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data)
    return [
      {
        title: 'Designsystemet',
      },
    ];
  return data.metadata;
};

export default function BestPractices() {
  const { cats, descriptions, lang } = useRouteLoaderData(
    'layouts/best-practices/layout',
  ) as LayoutRoute.ComponentProps['loaderData'];
  const { t } = useTranslation();

  return (
    <div
      className={'l-content-container u-default-padding-top'}
      style={{ paddingBottom: 'var(--ds-size-22)' }}
    >
      <Banner
        style={{ marginBottom: 'var(--page-spacing-top)' }}
        data-color='brand1'
        icon={<HandShakeHeartIcon />}
      >
        <BannerHeading level={1}>{t('best-practices.title')}</BannerHeading>
        <BannerIngress>{t('best-practices.description')}</BannerIngress>
      </Banner>
      {Object.entries(cats).map(([key, value], index) => {
        return (
          <Fragment key={key}>
            <Heading
              data-size='md'
              style={{
                marginTop: index === 0 ? '0' : 'var(--ds-size-15)',
                marginBottom: `var(--ds-size-5)`,
              }}
            >
              {key}
            </Heading>
            <Paragraph
              style={{
                maxWidth: '65ch',
              }}
            >
              {descriptions[key as keyof typeof descriptions] || 'Beskrivelse'}
            </Paragraph>
            <Grid>
              {value.map((item) => {
                return (
                  <TeaserCard
                    key={item.title}
                    title={item.title}
                    href={item.url}
                    description={item.description}
                    author={item.author}
                    date={formatDate(item.date, lang)}
                  />
                );
              })}
            </Grid>
          </Fragment>
        );
      })}
    </div>
  );
}
