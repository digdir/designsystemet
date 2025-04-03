import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as DS from '@digdir/designsystemet-react';
import type { ParagraphProps } from '@digdir/designsystemet-react';
import { bundleMDX } from 'mdx-bundler';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMemo } from 'react';
import { Image } from '~/_components/image/image';
import type { Route } from './+types/monstre-page';

export async function loader({ params }: Route.LoaderArgs) {
  const file = params.file || 'index';
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

const components = {
  ...DS,
  Image,
  p: (props: ParagraphProps) => <DS.Paragraph {...props} />,
};

export default function Monstre({ loaderData }: Route.ComponentProps) {
  // Create a component from the bundled code
  const Component = useMemo(() => {
    if (!loaderData.code) return null;
    return getMDXComponent(loaderData.code);
  }, [loaderData.code]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}
      >
        {loaderData.availableLanguages.nb && (
          <DS.Link href={`/nb/monstre/${loaderData.name}`}>
            {loaderData.currentLang === 'nb' && '✅'} Norsk (Bokmål)
          </DS.Link>
        )}
        {loaderData.availableLanguages.en && (
          <DS.Link href={`/en/monstre/${loaderData.name}`}>
            {loaderData.currentLang === 'en' && '✅'} English
          </DS.Link>
        )}
      </div>

      <DS.Heading level={1} data-size='xl'>
        Monstre {loaderData.frontmatter.title}
      </DS.Heading>
      {Component ? (
        /* @ts-ignore */
        <Component components={components} />
      ) : (
        'Kunne ikkje laste innhold'
      )}
    </div>
  );
}
