import { join } from 'node:path';
import { Heading, /* Link, */ Paragraph } from '@digdir/designsystemet-react';
//import { ArrowLeftIcon } from '@navikt/aksel-icons';
//import { Link as RouterLink } from 'react-router';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import type { Route } from './+types/page';
import classes from './page.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  const { '*': file } = params;

  // Read the file content
  const fileContent = getFileFromContentDir(
    join('god-praksis', params.lang, `${file}.mdx`),
  );

  // Bundle the MDX content
  const result = await generateFromMdx(fileContent);

  return {
    name: params.file,
    code: result.code,
    frontmatter: result.frontmatter,
    currentLang: params.lang,
  };
}

export const meta = ({ data }: Route.MetaArgs) => {
  return [{ title: `${data.frontmatter.title} - Designsystemet` }];
};

export default function GodPraksis({ loaderData }: Route.ComponentProps) {
  return (
    <main id='main'>
      <div className={classes.header}>
        <div className={classes.container}>
          <div className={classes.headerContent}>
            {/* TODO: url to the god-praksis route */}
            {/* <Link asChild className={classes.backBtn} data-color='neutral'>
              <RouterLink to={'/' + data.backUrl}>
                <ArrowLeftIcon title='Tilbake' fontSize={28} />
                God praksis
              </RouterLink>
            </Link> */}
            <Paragraph data-size='lg' variant='short' asChild>
              <div className={classes.meta}>
                <span>
                  {loaderData.frontmatter.author && (
                    <span>{loaderData.frontmatter.author}</span>
                  )}
                </span>
                <span className={classes.separator}> - </span>
                <span>
                  {loaderData.frontmatter.date && (
                    <div>{loaderData.frontmatter.date}</div>
                  )}
                </span>
              </div>
            </Paragraph>
            <Heading level={1} data-size='lg' className={classes.title}>
              {loaderData.frontmatter.title}
            </Heading>
          </div>
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.content}>
          <MDXComponents code={loaderData.code} />
        </div>
      </div>
    </main>
  );
}
