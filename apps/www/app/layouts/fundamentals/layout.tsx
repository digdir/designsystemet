import { join } from 'node:path';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import {
  getFileFromContentDir,
  getFilesFromContentDir,
} from '~/_utils/files.server';
import { getFrontmatter } from '~/_utils/get-frontmatter.server';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const mdxFiles = getFilesFromContentDir(join('fundamentals', lang));
  // console.log('Found MDX files:', mdxFiles);

  const cats: {
    [key: string]: {
      title: string;
      url: string;
      icon: string;
      color: 'red' | 'blue' | 'yellow';
      description: string;
      order: number;
    }[];
  } = {};

  if (lang === 'no') {
    cats['Start her'] = [];
    cats.Kode = [];
    cats.Tema = [];
    cats.Figma = [];
  }

  if (lang === 'en') {
    cats['Start here'] = [];
    cats.Code = [];
    cats.Theme = [];
    cats.Figma = [];
  }

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('fundamentals', lang, file.relativePath),
    );
    const frontmatter = getFrontmatter(fileContent);

    if (!frontmatter.published) {
      continue;
    }

    const title = frontmatter.title || file.relativePath.replace('.mdx', '');
    const url = `/${lang}/fundamentals/${file.relativePath.replace(
      '.mdx',
      '',
    )}`.replace(/\\/g, '/');

    if (!frontmatter.category) {
      continue;
    }

    if (!cats[frontmatter.category]) {
      cats[frontmatter.category] = [];
    }

    cats[frontmatter.category].push({
      title: frontmatter.sidebar_title || title,
      url,
      order: frontmatter.order,
      icon: frontmatter.icon,
      color: frontmatter.color || 'red',
      description: frontmatter.description || '',
    });
  }
  /* Sort articles by given order */
  for (const cat in cats) {
    cats[cat].sort((a, b) => {
      return a.order - b.order;
    });
  }

  return {
    lang,
    cats,
    descriptions: {
      Introduksjon:
        'Designsystemet inneholder grunnleggende designelementer, mønstre, god praksis og kodede komponenter som gir verdi å dele på tvers av offentlig sektor.',
      Designelementer:
        'Stilene i designsystemet er grunnleggende designelementer som brukes i komponentene. De finnes i flere sett for ulike identiteter og ulike behov og situasjoner. For eksempel har vi et eget sett for kompakt visning, som kan være hensiktsmessig å bruke i verktøy eller admingrensesnitt.',
      'For designere': 'Ressurser og veiledning relevant for designere',
      'For utviklere': 'Ressurser og veiledning relevant for utviklere',
    },
  };
};

export default function Layout({ loaderData: { cats } }: Route.ComponentProps) {
  const { t } = useTranslation();
  return (
    <div className={'l-content-container'}>
      <Sidebar cats={cats} hideCatTitle title={t('fundamentals.title')} />
      <div className={classes.content} id='main'>
        <Outlet />
      </div>
    </div>
  );
}
