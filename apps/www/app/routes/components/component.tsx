import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { Sandpack } from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';
import css from '@digdir/designsystemet-css?raw';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import theme from '@digdir/designsystemet-theme?raw';
import { ContentContainer } from '@internal/components';
import { Fragment } from 'react/jsx-runtime';
import designSystemRaw from '~/sandpack-build/index.js?raw';
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
    .filter((file) => file.endsWith('.tsx'))
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
      return {
        name: story,
        code: readFileSync(storyPath, 'utf-8'),
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
            <Sandpack
              theme={nightOwl}
              template='react'
              customSetup={{
                dependencies: {
                  '@floating-ui/dom': '^1.7.0',
                  '@floating-ui/react': '0.26.23',
                  '@navikt/aksel-icons': '^7.22.0',
                  '@radix-ui/react-slot': '^1.2.3',
                  '@tanstack/react-virtual': '^3.13.9',
                  '@u-elements/u-datalist': '^0.1.5',
                  '@u-elements/u-details': '^0.1.1',
                  '@u-elements/u-tags': '^0.1.4',
                  clsx: '^2.1.1',
                },
              }}
              files={{
                '/App.js': {
                  code: `import Code from './component.js';
import { Button } from '@digdir/designsystemet-react';
import './index.css';

export default function Sample() {
  return <><Code /></>
}`,
                  hidden: true,
                },
                '/component.js': {
                  code: story.code,
                },
                '/node_modules/@digdir/designsystemet-react/package.json': {
                  code: JSON.stringify({
                    name: '@digdir/designsystemet-react',
                    main: './index.js',
                  }),
                  hidden: true,
                },
                '/node_modules/@digdir/designsystemet-react/index.js': {
                  code: designSystemRaw,
                  hidden: true,
                },
                '/index.css': {
                  code: theme + '\n' + css,
                  hidden: true,
                },
              }}
              options={{
                /* readOnly: true, */
                visibleFiles: ['/component.js'],
                activeFile: '/component.js',
              }}
            />
          </Fragment>
        );
      })}
    </ContentContainer>
  );
}
