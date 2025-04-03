import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Paragraph } from '@digdir/designsystemet-react';
import { LayersIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { bundleMDX } from 'mdx-bundler';
import { Outlet, useLocation, useMatches } from 'react-router';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '~/_components/banner/banner';
import { ContentContainer } from '~/_components/content-container/content-container';
import { RRLink } from '~/_components/link';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  /* get all monstre content */
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  /* Get all files in /content/monstre for the lang we have selected */
  const files = readdirSync(
    join(process.cwd(), 'app', 'content', 'monstre', lang),
  );

  /* Filter out files that are not .mdx */
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  /* Get titles and URLs for all files */
  const cats: {
    [key: string]: {
      title: string;
      url: string;
    }[];
  } = {
    Ferdig: [],
    'Under arbeid': [],
    Kommende: [],
  };

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = readFileSync(
      join(process.cwd(), 'app', 'content', 'monstre', lang, `${file}`),
      'utf-8',
    );
    const result = await bundleMDX({
      source: fileContent,
    });

    const title = result.frontmatter.title || file.replace('.mdx', '');
    const url = file.replace('.mdx', '');

    if (!result.frontmatter.category) {
      continue;
    }

    if (!cats[result.frontmatter.category]) {
      cats[result.frontmatter.category] = [];
    }

    cats[result.frontmatter.category].push({
      title: result.frontmatter.sidebar_title || title,
      url,
    });
  }

  return { lang, cats };
};

export default function Layout({
  loaderData: { lang, cats },
}: Route.ComponentProps) {
  const matches = useMatches();
  const location = useLocation().pathname;

  console.log('location', location);

  /* if we have id monstre-page, hide banner */
  const isMonstrePage = matches.some((match) => match.id === 'monstre-page');

  return (
    <>
      {!isMonstrePage ? (
        <Banner color='yellow'>
          <BannerIcon>
            <LayersIcon />
          </BannerIcon>
          <BannerHeading level={1}>Mønstre</BannerHeading>
          <BannerIngress>
            Mønstre er retningslinjer og anbefalinger for hvordan interaksjon og
            gjentagende brukeroppgaver skal løses. Når de samme mønstrene brukes
            på tvers, skaper vi gjenkjennelighet i tjenestene.
          </BannerIngress>
        </Banner>
      ) : null}
      <ContentContainer>
        <div className={classes['sidebar-container']} data-color='neutral'>
          <div className={classes.sidebar}>
            <Paragraph data-size='md' asChild>
              <h2 className={classes.title}>Mønstre</h2>
            </Paragraph>
            <ul className={classes.list}>
              {Object.entries(cats).map(([key, value]) => {
                if (!value.length) {
                  return null;
                }
                return (
                  <li key={key} className={classes.listGroup}>
                    <Paragraph asChild data-size='md'>
                      <div className={classes.innerTitle}>{key}</div>
                    </Paragraph>
                    <ul className={classes.innerList}>
                      {value.map((item) => {
                        const url = `/${lang}/monstre/${item.url}`;

                        return (
                          <li key={item.url} className={classes.listItem}>
                            <Paragraph asChild data-size='sm'>
                              <RRLink
                                to={url}
                                className={cl(
                                  classes.link,
                                  url === location && classes.linkActive,
                                )}
                              >
                                {item.title}
                              </RRLink>
                            </Paragraph>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </ContentContainer>
    </>
  );
}
