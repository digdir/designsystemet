import { join } from 'node:path';
import { Breadcrumbs, Heading, Paragraph } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { EditPageOnGithub } from '~/_components/edit-page-on-github/edit-page-on-github';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { formatDate } from '~/_utils/date';
import { getFileFromContentDir } from '~/_utils/files';
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
    frontmatter: { title, author, date },
    code,
    lang,
  },
}: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={classes.header}>
        <div className={classes.container}>
          <div className={classes.headerContent}>
            <Breadcrumbs aria-label={t('best-practices.breadcrumbs-label')}>
              <Breadcrumbs.Link asChild data-color='neutral'>
                <RouterLink to={'../..'} relative='path'>
                  {t('best-practices.title')}
                </RouterLink>
              </Breadcrumbs.Link>
            </Breadcrumbs>
            <Paragraph data-size='lg' variant='short' asChild>
              <div className={classes.meta}>
                <span>{author && <span>{author}</span>}</span>
                <span className={classes.separator}> - </span>
                <span>{date && <div>{formatDate(date, lang)}</div>}</span>
              </div>
            </Paragraph>
            <Heading level={1} data-size='lg' className={classes.title}>
              {title}
            </Heading>
          </div>
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.content}>
          <MDXComponents code={code} />
          <EditPageOnGithub />
        </div>
      </div>
    </>
  );
}
