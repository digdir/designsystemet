import { join } from 'node:path';
import {
  Alert,
  Button,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { Error404 } from '@internal/components';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Link } from 'react-router';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/changelog';
import classes from './component.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  // Read the file content
  const fileContent = getFileFromContentDir(
    join('changelogs', `changelog.mdx`),
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

export default function Changelogs({
  loaderData: { code, frontmatter, lang },
}: Route.ComponentProps) {
  return (
    <>
      <div className={classes.header}>
        <div className={classes.headerUpper}>
          <div className={classes.headerText}>
            <Heading data-size='lg' level={1}>
              {frontmatter.title}
            </Heading>
          </div>
        </div>
        <div className={classes.headerBottom}>
          <Button asChild variant='tertiary'>
            <Link to={`https://www.npmjs.com/package/${frontmatter.package}`}>
              NPM
            </Link>
          </Button>
        </div>
      </div>
      <div className={cl(classes.content, 'u-rich-text')} lang='en'>
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
