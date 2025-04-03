import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { bundleMDX } from 'mdx-bundler';

import { Heading } from '@digdir/designsystemet-react';
import { MDXComponents } from '~/_components/mdx-components';
import type { Route } from './+types/monstre-page';

export async function loader({ params }: Route.LoaderArgs) {
  const file = params.file;
  const filePath = join(
    process.cwd(),
    'app',
    'content',
    'monstre',
    params.lang,
    `${file}.mdx`,
  );

  const nbExists = existsSync(
    join(process.cwd(), 'app', 'content', 'monstre', 'nb', `${file}.mdx`),
  );

  const enExists = existsSync(
    join(process.cwd(), 'app', 'content', 'monstre', 'en', `${file}.mdx`),
  );

  if (!existsSync(filePath)) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Read the file content
  const fileContent = readFileSync(filePath, 'utf-8');

  // Bundle the MDX content
  const result = await bundleMDX({
    source: fileContent,
  });

  return {
    name: params.file,
    code: result.code,
    frontmatter: result.frontmatter,
    currentLang: params.lang,
    availableLanguages: {
      nb: nbExists,
      en: enExists,
    },
  };
}

export const meta = ({ params }: Route.MetaArgs) => {
  return [{ title: `Monstre ${params.file} - ${params.lang}` }];
};

export default function Monstre({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Heading level={1} data-size='xl'>
        Monstre {loaderData.frontmatter.title}
      </Heading>
      <MDXComponents code={loaderData.code} />
    </div>
  );
}
