import { Heading, Paragraph } from '@digdir/designsystemet-react';
import * as Aksel from '@navikt/aksel-icons';
import { Fragment } from 'react';
import { useRouteLoaderData } from 'react-router';
import { Grid } from '~/_components/grid/grid';
import { NavigationCard } from '~/_components/navigation-card/navigation-card';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import type { Route as LayoutRoute } from '../../layouts/fundamentals/+types/layout';
import type { Route } from './+types/fundamentals';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const t = await i18n.getFixedT(lang);

  return {
    lang,
    metadata: generateMetadata({
      title: t('fundamentals.title'),
      description: t('fundamentals.description'),
    }),
  };
};

export const meta = ({ data: { metadata } }: Route.MetaArgs) => {
  return metadata;
};

export default function Fundamentals() {
  const { cats, descriptions } = useRouteLoaderData(
    'layouts/fundamentals/layout',
  ) as LayoutRoute.ComponentProps['loaderData'];

  return (
    <>
      {Object.entries(cats).map(([key, value]) => {
        return (
          <Fragment key={key}>
            <Heading data-size='md'>{key}</Heading>
            <Paragraph
              style={{
                maxWidth: '65ch',
              }}
            >
              {descriptions[key as keyof typeof descriptions]}
            </Paragraph>
            <Grid>
              {value.map((item) => {
                const Icon = item.icon
                  ? Aksel[item.icon as keyof typeof Aksel]
                  : Aksel.LayersIcon;
                return (
                  <NavigationCard
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
