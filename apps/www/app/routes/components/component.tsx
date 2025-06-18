import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

import { Heading, Paragraph } from '@digdir/designsystemet-react';

import { ContentContainer } from '@internal/components';
import { Fragment } from 'react/jsx-runtime';

import { SandpackComponent } from '~/_components/sandpack/sandpack';
import type { Route } from './+types/component';

const dirname = cwd();

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { component } = params;

  if (!component) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const basePath = join(dirname, './app/content');

  /* load component metadata */
  const metadata = readFileSync(
    join(basePath, 'components', component, 'metadata.json'),
    'utf-8',
  );

  /* get all stories */
  const storiesPaths = readdirSync(
    join(basePath, 'components', component, 'stories'),
  )
    .filter((file) => file.endsWith('.tsx') && !file.endsWith('.decorator.tsx'))
    .map((file) => file.replace('.tsx', ''));

  /* get code from stories */
  const stories = await Promise.all(
    storiesPaths.map(async (story) => {
      const storyPath = join(
        basePath,
        'components',
        component,
        'stories',
        `${story}.tsx`,
      );

      /* Check if story has a decorator in a .decorator.tsx file */
      const decoratorPath = join(
        basePath,
        'components',
        component,
        'stories',
        `${story}.decorator.tsx`,
      );
      if (
        readdirSync(
          join(basePath, 'components', component, 'stories'),
        ).includes(`${story}.decorator.tsx`)
      ) {
        const decoratorCode = readFileSync(decoratorPath, 'utf-8');
        return {
          name: story,
          code: readFileSync(storyPath, 'utf-8'),
          decoratorCode,
        };
      }

      return {
        name: story,
        code: readFileSync(storyPath, 'utf-8'),
        decoratorCode: null,
      };
    }),
  );

  return {
    component,
    metadata: JSON.parse(metadata),
    stories,
  };
};

export default function Components({
  loaderData: { stories, metadata },
}: Route.ComponentProps) {
  console.log(stories);

  return (
    <ContentContainer>
      <Heading>{metadata.title}</Heading>
      <Paragraph>{metadata.description}</Paragraph>
      {stories.map((story) => {
        return (
          <Fragment key={story.name}>
            <Heading level={2}>
              {story.name.replace(/([A-Z])/g, ' $1').trim()}
            </Heading>
            <SandpackComponent story={story} />
          </Fragment>
        );
      })}
    </ContentContainer>
  );
}
