import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Alert, Link, Paragraph } from '@digdir/designsystemet-react';
import { bundleMDX } from 'mdx-bundler';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMemo } from 'react';
import type { Route } from './+types/monstre';

export async function loader({ params, lang }: Route.LoaderArgs) {
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
    currentLang: params.lang,
    availableLanguages: {
      nb: nbExists,
      en: enExists,
    },
  };
}

export default function Monstre({ loaderData }: Route.ComponentProps) {
  // Create a component from the bundled code
  const Component = useMemo(() => {
    if (!loaderData.code) return null;
    return getMDXComponent(loaderData.code);
  }, [loaderData.code]);

  const components = {
    Alert,
    p: (props) => <Paragraph {...props} />,
  };

  return (
    <div className='p-4'>
      <div className='flex space-x-4 mb-6'>
        {loaderData.availableLanguages.nb && (
          <Link href={`/nb/monstre/${loaderData.name}`}>
            Norsk (Bokmål) {loaderData.currentLang === 'nb' && '(Valgt)'}
          </Link>
        )}
        <br />
        {loaderData.availableLanguages.en && (
          <Link href={`/en/monstre/${loaderData.name}`}>
            English {loaderData.currentLang === 'en' && '(Valgt)'}
          </Link>
        )}
      </div>

      <h1 className='text-2xl mb-4'>Monstre {loaderData.name}</h1>
      {Component ? (
        <Component components={components} />
      ) : (
        'Kunne ikkje laste innhold'
      )}
    </div>
  );
}
