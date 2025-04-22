import { join } from 'node:path';
import { Heading } from '@digdir/designsystemet-react';
import { ComponentIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { formatDateNorwegian } from '~/_utils/date';
import { getFileFromContentDir } from '~/_utils/files';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import type { Route } from './+types/page';
import classes from './page.module.css';

export async function loader({ params }: Route.LoaderArgs) {
  const file = params.file;

  // Read the file content
  const fileContent = getFileFromContentDir(
    join('monstre', params.lang, `${file}.mdx`),
  );

  // Bundle the MDX content
  const result = await generateFromMdx(fileContent);

  return {
    name: params.file,
    code: result.code,
    frontmatter: result.frontmatter,
  };
}

export const meta = ({ params }: Route.MetaArgs) => {
  return [{ title: `Monstre ${params.file} - ${params.lang}` }];
};

export default function Monstre({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <div className={classes.header}>
        <div className={classes.headerText}>
          <Heading data-size='lg' level={1}>
            {loaderData.frontmatter.title}
          </Heading>
          {loaderData.frontmatter.date && (
            <div className={classes.date}>
              {formatDateNorwegian(loaderData.frontmatter.date)}
            </div>
          )}
        </div>
        <div className={cl(classes.iconContainer)}>
          <ComponentIcon fontSize='4rem' aria-hidden='true' />
        </div>
      </div>
      <div className={classes.content}>
        <MDXComponents code={loaderData.code} />
      </div>
    </>
  );
}
