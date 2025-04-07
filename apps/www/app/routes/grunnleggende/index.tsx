import { Heading } from '@digdir/designsystemet-react';
import * as Aksel from '@navikt/aksel-icons';
import { Fragment } from 'react';
import { useRouteLoaderData } from 'react-router';
import { Grid } from '~/_components/grid/grid';
import { NavigationCard } from '~/_components/navigation-card/navigation-card';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from '../../layouts/grunnleggende/+types/layout';

export const meta = () => {
  return generateMetadata({
    title: 'Grunnleggende',
    description: 'Grunnleggende',
  });
};

export default function Monstre() {
  const { cats, descriptions } = useRouteLoaderData(
    'layouts/grunnleggende/layout',
  ) as Route.ComponentProps['loaderData'];

  return (
    <>
      {Object.entries(cats).map(([key, value]) => {
        return (
          <Fragment key={key}>
            <Heading>{key}</Heading>
            <p>
              {descriptions[key as keyof typeof descriptions] || 'Beskrivelse'}
            </p>
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
