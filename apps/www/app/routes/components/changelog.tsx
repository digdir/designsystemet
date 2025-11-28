import { join } from 'node:path';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Error404 } from '@internal/components';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse } from 'react-router';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/changelog';
import classes from './component.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  // Read the file content
  const fileContent = getFileFromContentDir(
    join('components-docs', `changelog.mdx`),
  );

  if (!fileContent) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Bundle the MDX content
  const result = await generateFromMdx(fileContent);

  return {
    code: result.code,
    frontmatter: result.frontmatter,
    lang: params.lang,
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

export default function Changelogs({
  loaderData: { code, lang },
}: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={classes.textPageHeader}>
        <Heading data-size='lg' level={1}>
          {t('components.changelog.title', 'Changelog')}
        </Heading>
      </div>
      <div
        className={cl(
          classes.textPage,
          classes.changelog,
          'u-rich-text left-adjusted',
        )}
        lang='en'
      >
        {lang !== 'en' ? (
          <Alert lang='no'>
            Endringslogger er kun tilgjengelige på engelsk
          </Alert>
        ) : null}
        <MDXComponents code={code} />
      </div>
    </>
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
