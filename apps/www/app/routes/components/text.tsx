import { join } from 'node:path';
import { cwd } from 'node:process';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Error404 } from '@internal/components';
import cl from 'clsx/lite';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useRouteLoaderData } from 'react-router';
import {
  LiveComponent,
  type LiveComponentProps,
} from '~/_components/live-component/live-components';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { extractStories } from '~/_utils/extract-stories.server';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/text';
import classes from './component.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  const { '*': file, lang } = params;
  const dirname = cwd();
  const basePath = join(dirname, './app/content');

  // Read the file content
  const fileContent = getFileFromContentDir(
    join('components-docs', lang, `${file}.mdx`),
  );

  if (!fileContent) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Bundle the MDX content
  const result = await generateFromMdx(fileContent);
  const storyEntries = extractStories(
    join(basePath, 'components-docs', lang, `${file}.stories.tsx`),
  );

  return {
    code: result.code,
    frontmatter: result.frontmatter,
    lang: params.lang,
    stories: storyEntries,
    metadata: {
      title: result.frontmatter.title,
    },
  };
}

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data)
    return [
      {
        title: 'Designsystemet',
      },
    ];
  const {
    metadata: { title },
    frontmatter,
  } = data;
  return generateMetadata({
    title,
    description: frontmatter.description,
  });
};

export default function Text({
  loaderData: { code, frontmatter },
}: Route.ComponentProps) {
  return (
    <>
      <div className={classes.textPageHeader}>
        <Heading data-size='lg' level={1}>
          {frontmatter.title}
        </Heading>
      </div>
      <div className={cl(classes.textPage, 'u-rich-text left-adjusted')}>
        <MDXComponents
          code={code}
          components={{
            Story: Story as unknown as ComponentType<unknown>,
          }}
        />
      </div>
    </>
  );
}

const Story = ({ story, layout }: LiveComponentProps) => {
  const data = useRouteLoaderData<Route.ComponentProps['loaderData']>(
    'component-text-page',
  );
  if (!data) return null;

  const { stories } = data;

  const foundStory = stories.find((s) => s.name === story);
  if (!foundStory) return <Alert lang='en'>Story not found: {story}</Alert>;
  return (
    <LiveComponent
      story={`${foundStory.code}\n\nrender(<${foundStory.name} />)`}
      layout={layout}
    />
  );
};

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();

  const message = t('errors.default.title');
  let details = t('errors.default.details');

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Error404 />;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
  }

  return (
    <div>
      <Heading level={1}>{message}</Heading>
      <Paragraph>{details}</Paragraph>
    </div>
  );
}
