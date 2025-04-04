import { Heading } from '@digdir/designsystemet-react';
import { Fragment } from 'react';
import { useRouteLoaderData } from 'react-router';
import { Grid } from '~/_components/grid/Grid';
import { NavigationCard } from '~/_components/navigation-card/navigation-card';
import type { Route } from '../../layouts/grunnleggende/+types/layout';

export const meta = () => {
  return [
    {
      title: 'grunnleggende',
      description: 'grunnleggende',
    },
  ];
};

export default function Monstre() {
  const { cats, lang } = useRouteLoaderData(
    'layouts/grunnleggende/layout',
  ) as Route.ComponentProps['loaderData'];

  return (
    <>
      {Object.entries(cats).map(([key, value]) => {
        console.log(value);
        return (
          <Fragment key={key}>
            <Heading>{key}</Heading>
            <p>Beskrivelse her</p>
            <Grid>
              {value.map((item) => {
                return (
                  <NavigationCard
                    key={item.title}
                    title={item.title}
                    url={item.url}
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
