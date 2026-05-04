import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { PencilLineIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { ComponentType } from 'react';
import type { ComponentDoc } from 'react-docgen-typescript';
import { useTranslation } from 'react-i18next';
import { NavLink, redirect, useRouteLoaderData } from 'react-router';
import {
  CssAttributes,
  getAttributes,
} from '~/_components/css-attributes/css-attributes';
import {
  CssVariables,
  getCssVariables,
} from '~/_components/css-variables/css-variables';
import { EditPageOnGithub } from '~/_components/edit-page-on-github/edit-page-on-github';
import { IconFrame } from '~/_components/icon-frame/icon-frame';
import { LiveComponent } from '~/_components/live-component/live-components';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { ReactComponentDocs } from '~/_components/react-component-props/react-component-props';
import { TableOfContents } from '~/_components/table-of-contents/toc';
import { extractStories } from '~/_utils/extract-stories.server';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { getComponentDocs } from '~/_utils/get-react-props.server';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/component';
import classes from './component.module.css';

const require = createRequire(import.meta.url);

// Cache CSS resolution and parsing per cssFile — shared across all pages for the same component
const cssCache = new Map<
  string,
  {
    cssSource?: string;
    cssVars: Record<string, string>;
    cssAttrs: Record<string, string>;
  }
>();
const warnedCssFiles = new Set<string>();

const getComponentCss = (cssFile: string) => {
  const cached = cssCache.get(cssFile);
  if (cached) return cached;

  const emptyResult = {
    cssSource: undefined,
    cssVars: {},
    cssAttrs: {},
  };

  try {
    const cssPath = require.resolve(`@digdir/designsystemet-css/${cssFile}`);
    const cssSource = readFileSync(cssPath, 'utf-8');
    const result = {
      cssSource,
      cssVars: getCssVariables(cssSource),
      cssAttrs: getAttributes(cssSource),
    };

    cssCache.set(cssFile, result);
    return result;
  } catch (error) {
    if (!warnedCssFiles.has(cssFile)) {
      warnedCssFiles.add(cssFile);
      console.warn(
        `Failed to resolve or read CSS file "@digdir/designsystemet-css/${cssFile}".`,
        error,
      );
    }

    return emptyResult;
  }
};

export { ErrorBoundary } from '~/root';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { component, lang } = params;

  if (!component) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }
  const componentDir = join('app', 'content', 'components', component);

  if (!existsSync(componentDir)) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  if (
    !request.url.includes('code') &&
    !request.url.includes('overview') &&
    !request.url.includes('accessibility')
  ) {
    if (
      request.url.endsWith(`/${component}`) ||
      request.url.endsWith(`/${component}/`)
    ) {
      return redirect(`/${lang}/components/docs/${component}/overview`);
    }

    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const trimmedUrl = request.url.endsWith('/')
    ? request.url.slice(0, -1)
    : request.url;
  const compPage = trimmedUrl.split('/').pop();

  const componentDocs = getComponentDocs(component);

  // Extract exported story functions from *.stories.tsx
  const storyEntries = extractStories(componentDir);
  // Extract exported dodont functions from *.dodont.tsx
  const doDontEntries = extractStories(componentDir, true);

  const jsonMetadata: {
    [lang: string]: {
      title: string;
      subtitle: string;
    };
  } & {
    image: string;
    cssFile: string;
  } = JSON.parse(
    getFileFromContentDir(join('components', component, 'metadata.json')),
  );

  const mdxSource = getFileFromContentDir(
    join('components', component, lang, `${compPage}.mdx`),
  );

  const result = await generateFromMdx(mdxSource);
  const subtitleFromMetadata = await generateFromMdx(
    jsonMetadata[lang].subtitle,
  );

  const { cssSource, cssVars, cssAttrs } = getComponentCss(
    jsonMetadata.cssFile,
  );

  return {
    component,
    stories: storyEntries,
    dodont: doDontEntries,
    mdxCode: result.code,
    metadata: {
      ...jsonMetadata[lang],
      image: jsonMetadata.image,
      subtitle: subtitleFromMetadata.code,
    },
    linkMetadata: generateMetadata({
      title: jsonMetadata[lang].title,
      description: jsonMetadata[lang].subtitle,
    }),
    cssSource,
    cssVars,
    cssAttrs,
    toc: result.toc,
    componentDocs,
    navigation: {
      overviewLink: `/${lang}/components/docs/${component}/overview`,
      codeLink: `/${lang}/components/docs/${component}/code`,
      accessibilityLink: `/${lang}/components/docs/${component}/accessibility`,
    },
    githubLink: `https://github.com/digdir/designsystemet/tree/main/apps/www/app/content/components/${component}/${lang}/${compPage}.mdx`,
  };
};

export const meta = ({ loaderData }: Route.MetaArgs) => {
  if (!loaderData?.linkMetadata)
    return [
      {
        title: 'Designsystemet',
      },
    ];
  return loaderData.linkMetadata;
};

export default function Components({
  loaderData: { stories, mdxCode, metadata, toc, navigation, githubLink },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const feedbackUrl = new URL(
    'https://github.com/digdir/designsystemet/issues/new',
  );
  feedbackUrl.searchParams.set('template', 'BLANK_ISSUE');
  feedbackUrl.searchParams.set('title', `Feedback: ${metadata.title}`);
  return (
    <>
      <div className={classes.header}>
        <div className={classes.headerUpper}>
          <div className={classes.headerText}>
            <Heading data-size='xs' asChild>
              <p>{t('components.title')}</p>
            </Heading>
            <Heading data-size='lg' level={1}>
              {metadata.title}
            </Heading>
            <MDXComponents code={metadata.subtitle} />
          </div>
          <IconFrame className={classes.iconFrame} data-color='brand3'>
            <img
              src={'/img/component-previews/' + metadata.image}
              alt={metadata.title}
              aria-hidden='true'
            />
          </IconFrame>
        </div>
        <div className={classes.headerBottom}>
          <Button asChild variant='tertiary'>
            <NavLink to={navigation.overviewLink}>
              {t('component.overview')}
            </NavLink>
          </Button>
          <Button asChild variant='tertiary'>
            <NavLink to={navigation.codeLink}>{t('component.code')}</NavLink>
          </Button>
          <Button asChild variant='tertiary'>
            <NavLink to={navigation.accessibilityLink}>
              {t('component.accessibility')}
            </NavLink>
          </Button>
        </div>
      </div>
      <TableOfContents items={toc} level={3}>
        <div className={'toc-feedback'}>
          <Paragraph data-size='sm'>{t('toc.feedback.component')}</Paragraph>
          <Button data-size='sm' variant='secondary' asChild>
            <a href={feedbackUrl.toString()}>
              <PencilLineIcon aria-hidden /> {t('toc.feedback.link')}
            </a>
          </Button>
        </div>
      </TableOfContents>

      <div className={cl(classes.content, 'u-rich-text')}>
        {mdxCode ? (
          <MDXComponents
            code={mdxCode}
            components={{
              ReactComponentDocs:
                PropsTable as unknown as ComponentType<unknown>,
              CssVariables: CssVars as unknown as ComponentType<unknown>,
              CssAttributes: Attributes as unknown as ComponentType<unknown>,
            }}
          />
        ) : (
          stories.map((story) => (
            <LiveComponent
              key={story.name}
              story={`${story.code.trim()}\nrender(<${story.name} />)`}
            />
          ))
        )}
        <EditPageOnGithub href={githubLink} />
      </div>
    </>
  );
}

const PropsTable = () => {
  const data =
    useRouteLoaderData<Route.ComponentProps['loaderData']>('components-page');
  if (!data) return null;

  const { componentDocs } = data;

  return <ReactComponentDocs docs={componentDocs as ComponentDoc[]} />;
};

const CssVars = () => {
  const data =
    useRouteLoaderData<Route.ComponentProps['loaderData']>('components-page');
  if (!data) return null;

  const { cssVars } = data;

  return cssVars ? <CssVariables vars={cssVars} /> : null;
};

const Attributes = () => {
  const { t } = useTranslation();

  const data =
    useRouteLoaderData<Route.ComponentProps['loaderData']>('components-page');
  if (!data)
    return <Paragraph>{t('components.no-relevant-data-attributes')}</Paragraph>;

  const { cssAttrs } = data;

  return cssAttrs ? (
    <CssAttributes vars={cssAttrs} />
  ) : (
    <Paragraph>{t('components.no-relevant-data-attributes')}</Paragraph>
  );
};
