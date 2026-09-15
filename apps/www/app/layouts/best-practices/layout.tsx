import { join } from 'node:path';
import { Outlet } from 'react-router';
import {
  getFileFromContentDir,
  getFilesFromContentDir,
} from '~/_utils/files.server';
import { getFrontmatter } from '~/_utils/get-frontmatter.server';
import type { Route } from './+types/layout';

export { ErrorBoundary } from '~/root';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const mdxFiles = getFilesFromContentDir(join('best-practices', lang));

  const cats: {
    [key: string]: {
      title: string;
      url: string;
      description: string;
      author: string;
      date: string;
      published?: boolean;
    }[];
  } = {};

  if (lang === 'no') {
    cats.Tilgjengelighet = [];
    cats.Innholdsarbeid = [];
    cats.Brukerinnsikt = [];
  }

  if (lang === 'en') {
    cats.Accessibility = [];
    cats['Content work'] = [];
    cats['User insight'] = [];
  }

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('best-practices', lang, file.relativePath),
    );
    const frontmatter = getFrontmatter(fileContent);

    if (!frontmatter.published) {
      continue;
    }

    const title = frontmatter.title || file.relativePath.replace('.mdx', '');
    const url = `/${lang}/best-practices/${file.relativePath.replace('.mdx', '')}`;
    const author = frontmatter.author || '';
    const date = frontmatter.date || '';

    if (!frontmatter.category) {
      continue;
    }

    if (!cats[frontmatter.category]) {
      cats[frontmatter.category] = [];
    }

    cats[frontmatter.category].push({
      title,
      url,
      author,
      date,
      description: frontmatter.description || '',
    });
  }
  /* Sort articles by date */
  for (const cat in cats) {
    cats[cat].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  let descriptions = {};
  if (lang === 'no') {
    descriptions = {
      Brukerinnsikt: 'Designressurser og kunnskapsdeling rundt brukerinnsikt.',
      Tilgjengelighet:
        'Tilgjengelighet og universell utforming handler om at det vi lager skal kunne brukes av alle uavhengig av funksjonsevne eller brukskontekst.',
      Innholdsarbeid:
        'Brukerne skal finne, forstå og gjøre det de kom til tjenesten for å gjøre. Derfor er det viktig at vi skriver brukertilpasset, klart og tydelig.',
    };
  }
  if (lang === 'en') {
    descriptions = {
      'User insight':
        'Design resources and knowledge sharing around user insight.',
      Accessibility:
        'Accessibility and universal design mean that what we create should be usable by everyone, regardless of functional ability or use context.',
      'Content work':
        'Users should find, understand, and do what they came to the service to do. Therefore, it is important that we write user-adapted, clear, and concise.',
    };
  }

  return {
    lang,
    cats,
    descriptions,
  };
};

export default function Layout() {
  return (
    <div id='main'>
      <Outlet />
    </div>
  );
}
