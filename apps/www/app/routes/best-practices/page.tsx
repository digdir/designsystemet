import { join } from 'node:path';
import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { PencilLineIcon } from '@navikt/aksel-icons';
import cl from 'clsx';
import { useTranslation } from 'react-i18next';
import { AvatarStack } from '~/_components/avatar-stack/avatar-stack';
import { EditPageOnGithub } from '~/_components/edit-page-on-github/edit-page-on-github';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { TableOfContents } from '~/_components/table-of-contents/toc';
import { formatDate } from '~/_utils/date';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/page';
import classes from './page.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  const { '*': file } = params;

  // Read the file content
  const fileContent = getFileFromContentDir(
    join('best-practices', params.lang, `${file}.mdx`),
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
    toc: result.toc,
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

export default function BestPractices({
  loaderData: {
    frontmatter: { title, author, date, description },
    code,
    lang,
    toc,
  },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const feedbackUrl = `https://github.com/digdir/designsystemet/issues/new?template=BLANK_ISSUE&title=Feedback: Best practices - ${title}`;
  return (
    <div className={cl('l-content-container')}>
      <div className={classes.container}>
        <div className={classes.header}>
          <Heading data-size='xs' asChild>
            <p>{t('best-practices.title')}</p>
          </Heading>
          <Heading level={1} data-size='lg' className={classes.title}>
            {title}
          </Heading>
          {description && (
            <Paragraph data-size='lg' style={{ marginTop: '12px' }}>
              {description}
            </Paragraph>
          )}
          <Paragraph variant='short' asChild>
            <div className={classes.meta}>
              {author && (
                <>
                  <AvatarStack authors={author} /> <span>{author}</span>
                </>
              )}

              <span className={classes.separator}>·</span>
              <span>
                {date && (
                  <div>{`${t('updated')} ${formatDate(date, lang)}`}</div>
                )}
              </span>
            </div>
          </Paragraph>
        </div>
        <TableOfContents
          className={classes.tableOfContents}
          title={'På denne siden'}
          items={toc}
        >
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
        <div className={cl(classes.content, 'u-rich-text', 'left-adjusted')}>
          <MDXComponents code={code} />
          <EditPageOnGithub />
        </div>
      </div>
    </div>
  );
}
