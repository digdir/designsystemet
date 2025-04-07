import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {} from '@digdir/designsystemet-react';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
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

  const fileContent = readFileSync(
    join(process.cwd(), 'app', 'content', 'monstre', `${lang}_index.mdx`),
    'utf-8',
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
