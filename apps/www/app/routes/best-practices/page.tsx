import { join } from 'node:path';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx';
import { useTranslation } from 'react-i18next';
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
  return (
    <div className={cl('l-content-container')}>
      <div className={classes.container}>
        <div className={classes.header}>
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
              <span>{author && <span>{author}</span>}</span>
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
        />
        <div className={cl(classes.content, 'u-rich-text', 'left-adjusted')}>
          <MDXComponents code={code} />
          <EditPageOnGithub />
        </div>
      </div>
    </div>
  );
}
