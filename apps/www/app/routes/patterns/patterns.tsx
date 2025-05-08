import { join } from 'node:path';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import type { Route } from './+types/patterns';
import classes from './page.module.css';

export const loader = async ({
  params: { lang },
}: Route.LoaderArgs): Promise<{
  index: Awaited<ReturnType<typeof generateFromMdx>>;
  lang: string;
  metadata: ReturnType<typeof generateMetadata>;
}> => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  /* Map over files with mdx parser to get title */

  const fileContent = getFileFromContentDir(
    join('patterns', `${lang}_index.mdx`),
  );
  const result = await generateFromMdx(fileContent);

  const t = await i18n.getFixedT(lang);

  return {
    index: result,
    lang,
    metadata: generateMetadata({
      title: t('patterns.title'),
      description: t('patterns.description'),
    }),
  };
};

export const meta: Route.MetaFunction = ({
  data: { metadata },
}: Route.MetaArgs) => {
  return metadata;
};

export default function Patterns({
  loaderData: { index },
}: Route.ComponentProps) {
  return (
    <div className={classes.content}>
      <MDXComponents code={index.code} />
    </div>
  );
}
