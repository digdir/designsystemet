import { join } from 'node:path';
import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Error404 } from '@internal/components';
import { PencilLineIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse } from 'react-router';
import { AvatarStack } from '~/_components/avatar-stack/avatar-stack';
import { EditPageOnGithub } from '~/_components/edit-page-on-github/edit-page-on-github';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { TableOfContents } from '~/_components/table-of-contents/toc';
import { formatDate } from '~/_utils/date';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import { getStories } from '../../_utils/get-stories.server';
import type { Route } from './+types/page';
import classes from './page.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  const file = params.file;

  // Read the file content
  const fileContent = getFileFromContentDir(
    join('patterns', params.lang, `${file}.mdx`),
  );

  if (!fileContent) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const stories = await getStories({
    path: join('patterns', params.lang, `${file}.stories.tsx`),
  });

  // Bundle the MDX content
  const result = await generateFromMdx(fileContent);

  return {
    name: params.file,
    code: result.code,
    frontmatter: result.frontmatter,
    lang: params.lang,
    toc: result.toc,
    stories,
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
  loaderData: { lang, frontmatter, code, toc },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const feedbackUrl = `https://github.com/digdir/designsystemet/issues/new?template=BLANK_ISSUE&title=Feedback: Patterns - ${frontmatter.title}`;
  return (
    <>
      <div className={classes.header}>
        <div className={classes.headerText}>
          <Heading data-size='xs' asChild>
            <p>{t('patterns.title')}</p>
          </Heading>
          <Heading data-size='lg' level={1}>
            {frontmatter.title}
          </Heading>
          {frontmatter.description && (
            <Paragraph data-size='lg' style={{ marginTop: '12px' }}>
              {frontmatter.description}
            </Paragraph>
          )}
          <Paragraph variant='short' asChild>
            <div className={classes.meta}>
              {frontmatter.partners && (
                <>
                  <a
                    href='#article-contributors'
                    aria-label={t('contributors')}
                  >
                    <AvatarStack
                      authors={frontmatter.partners}
                      expandable='fixed'
                    />
                  </a>
                  <span className={classes.partners}>
                    {frontmatter.partners}
                  </span>
                </>
              )}
              <span>
                {frontmatter.date && (
                  <span
                    className={classes.date}
                  >{`${t('updated')} ${formatDate(frontmatter.date, lang)}`}</span>
                )}
              </span>
            </div>
          </Paragraph>
        </div>
      </div>
      <TableOfContents title={frontmatter.title} items={toc}>
        <div className='toc-feedback'>
          <Paragraph data-size='sm'>{t('toc.feedback.page')}</Paragraph>
          <Button
            data-color='neutral'
            data-size='sm'
            variant='secondary'
            asChild
          >
            <a href={feedbackUrl}>
              <PencilLineIcon aria-hidden /> {t('toc.feedback.link')}
            </a>
          </Button>
        </div>
      </TableOfContents>
      <div className={cl(classes.content, 'u-rich-text')}>
        <MDXComponents code={code} />
        <EditPageOnGithub />
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
    <div id='main'>
      <Heading level={1}>{message}</Heading>
      <Paragraph>{details}</Paragraph>
    </div>
  );
}
