import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Fragment } from 'react';
import { useRouteLoaderData } from 'react-router';
import { Grid } from '~/_components/grid/grid';
import { TeaserCard } from '~/_components/teaser-card/teaser-card';
import { formatDate } from '~/_utils/date';
import { generateMetadata } from '~/_utils/metadata';
import { getInstance } from '~/middleware/i18next';
import type { Route as LayoutRoute } from '../../layouts/best-practices/+types/layout';
import type { Route } from './+types/best-practices';

export const loader = async ({
  params: { lang },
  context,
}: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  let t: (ns: string) => string = (ns: string) => '';

  try {
    const i18n = getInstance(context);
    /* @ts-ignore */
    t = i18n.getFixedT(lang);
  } catch (error) {
    return {
      lang,
      metadata: [],
    };
  }

  return {
    lang,
    metadata: generateMetadata({
      title: t('best-practices.title'),
      description: t('best-practices.description'),
    }),
  };
};

export const meta = ({ data: { metadata } }: Route.MetaArgs) => {
  return metadata;
};

export default function BestPractices() {
  const { cats, descriptions, lang } = useRouteLoaderData(
    'layouts/best-practices/layout',
  ) as LayoutRoute.ComponentProps['loaderData'];

  return (
    <>
      {Object.entries(cats).map(([key, value], index) => {
        return (
          <Fragment key={key}>
            <Heading
              data-size='md'
              style={{
                marginTop: index === 0 ? '0' : 'var(--ds-size-10)',
                marginBottom: `var(--ds-size-3)`,
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
    </>
  );
}
