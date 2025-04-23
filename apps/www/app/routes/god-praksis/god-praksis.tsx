import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Fragment } from 'react';
import { useRouteLoaderData } from 'react-router';
import { Grid } from '~/_components/grid/grid';
import { TeaserCard } from '~/_components/teaser-card/teaser-card';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from '../../layouts/god-praksis/+types/layout';

export const meta = () => {
  return generateMetadata({
    title: 'God praksis',
    description: 'God praksis',
  });
};

export default function GodPraksis() {
  const { cats, descriptions } = useRouteLoaderData(
    'layouts/god-praksis/layout',
  ) as Route.ComponentProps['loaderData'];

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
                    date={item.date}
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
