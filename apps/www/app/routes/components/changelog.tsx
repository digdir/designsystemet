import { join } from 'node:path';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Error404 } from '@internal/components';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse } from 'react-router';
import { EditPageOnGithub } from '~/_components/edit-page-on-github/edit-page-on-github';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/changelog';

export async function loader({ params }: Route.LoaderArgs) {
  const file = params.package;

  // Read the file content
  const fileContent = getFileFromContentDir(join('changelogs', `${file}.mdx`));

  if (!fileContent) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Bundle the MDX content
  const result = await generateFromMdx(fileContent);

  return {
    name: params.package,
    code: result.code,
    frontmatter: result.frontmatter,
    lang: params.lang,
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
    frontmatter: { title, description },
  } = data;
  return generateMetadata({
    title,
    description,
  });
};

export default function Patterns({
  loaderData: { code, frontmatter },
}: Route.ComponentProps) {
  return (
    <div className={'u-rich-text'}>
      <Heading>{frontmatter.title}</Heading>
      <MDXComponents code={code} />
      <EditPageOnGithub />
    </div>
  );
}

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
