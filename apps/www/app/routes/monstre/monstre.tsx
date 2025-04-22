import { join } from 'node:path';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import type { Route } from './+types';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  /* Map over files with mdx parser to get title */

  const fileContent = getFileFromContentDir(
    join('monstre', `${lang}_index.mdx`),
  );
  const result = await generateFromMdx(fileContent);

  return { index: result, lang };
};

export const meta = () => {
  return [
    {
      title: 'Mønstre',
      description: 'Mønstre',
    },
  ];
};

export default function Monstre({
  loaderData: { index },
}: Route.ComponentProps) {
  return (
    <>
      <MDXComponents code={index.code} />
    </>
  );
}
