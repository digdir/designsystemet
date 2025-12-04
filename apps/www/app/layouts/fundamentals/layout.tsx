import { join } from 'node:path';
import { useTranslation } from 'react-i18next';
import { Outlet, useMatches } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import {
  getFileFromContentDir,
  getFilesFromContentDir,
} from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
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
    cats.Introduksjon = [];
    cats['Design Tokens'] = [];
    cats.Temabygger = [];
    cats.Kode = [];
    cats.Figma = [];
    cats.Ressurser = [];
  }

  if (lang === 'en') {
    cats.Introduction = [];
    cats['Design Tokens'] = [];
    cats['Theme Builder'] = [];
    cats.Code = [];
    cats.Figma = [];
    cats.Resources = [];
  }

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('fundamentals', lang, file.relativePath),
    );
    const result = await generateFromMdx(fileContent);

    if (!result.frontmatter.published) {
      continue;
    }

    const title =
      result.frontmatter.title || file.relativePath.replace('.mdx', '');
    const url =
      `/${lang}/fundamentals/${file.relativePath.replace('.mdx', '')}`.replace(
        '\\',
        '/',
      );

    if (!result.frontmatter.category) {
      continue;
    }

    if (!cats[result.frontmatter.category]) {
      cats[result.frontmatter.category] = [];
    }

    cats[result.frontmatter.category].push({
      title: result.frontmatter.sidebar_title || title,
      url,
      order: result.frontmatter.order,
      icon: result.frontmatter.icon,
      color: result.frontmatter.color || 'red',
      description: result.frontmatter.description || '',
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
  const matches = useMatches();
  const { t } = useTranslation();

  /* if we have id fundamentals-page, hide banner */
  const isGrunnleggendePage = matches.some(
    (match) => match.id === 'fundamentals-page',
  );

  return (
    <div className={'l-content-container'} data-is-main={!isGrunnleggendePage}>
      <Sidebar cats={cats} hideCatTitle title={t('fundamentals.title')} />
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
}
