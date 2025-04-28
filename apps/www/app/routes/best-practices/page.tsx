import { join } from 'node:path';
import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
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

  // Bundle the MDX content
  const result = await generateFromMdx(fileContent);

  return {
    name: params.file,
    code: result.code,
    frontmatter: result.frontmatter,
    lang: params.lang,
  };
}

export const meta = ({ data }: Route.MetaArgs) => {
  return generateMetadata({
    title: data.frontmatter.title,
    description: data.frontmatter.description,
  });
};

export default function GodPraksis({
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
            <Link asChild className={classes.backBtn} data-color='neutral'>
              <RouterLink to={'../..'} relative='path'>
                <ArrowLeftIcon title={t('best-practices.back')} fontSize={28} />
                {t('best-practices.title')}
              </RouterLink>
            </Link>
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
