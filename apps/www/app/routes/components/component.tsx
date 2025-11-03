import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import {
  Alert,
  Button,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type { ComponentType, ReactNode } from 'react';
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
import { DoDont } from '~/_components/do-dont/do-dont';
import { EditPageOnGithub } from '~/_components/edit-page-on-github/edit-page-on-github';
import {
  LiveComponent,
  type LiveComponentProps,
} from '~/_components/live-component/live-components';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { ReactComponentDocs } from '~/_components/react-component-props/react-component-props';
import { TableOfContents } from '~/_components/table-of-contents/toc';
import { extractStories } from '~/_utils/extract-stories.server';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { getComponentDocs } from '~/_utils/get-react-props.server';
import type { Route } from './+types/component';
import classes from './component.module.css';

const require = createRequire(import.meta.url);

export { ErrorBoundary } from '~/root';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { component, lang } = params;

  if (process.env.APP_ENV === 'production') {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  if (!component) {
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
      return redirect(`/${lang}/components/${component}/overview`);
    }

    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const trimmedUrl = request.url.endsWith('/')
    ? request.url.slice(0, -1)
    : request.url;
  const compPage = trimmedUrl.split('/').pop();

  const componentDocs = getComponentDocs(component);

  const componentDir = join('app', 'content', 'components', component);

  // Extract exported story functions from *.stories.tsx
  const storyEntries = extractStories(componentDir);
  // Extract exported dodont functions from *.dodont.tsx
  const doDontEntries = extractStories(componentDir, true);

  const mdxSource = getFileFromContentDir(
    join('components', component, lang, `${compPage}.mdx`),
  );

  const result = await generateFromMdx(mdxSource);

  // Resolve raw CSS for this component from @digdir/designsystemet-css

  let cssPath: string | undefined;

  try {
    cssPath = require.resolve(
      `@digdir/designsystemet-css/${result.frontmatter.cssfile}.css`,
    );
  } catch {}

  let cssSource: string | undefined;
  let cssVars: {
    [key: string]: string;
  } = {};
  let cssAttrs: {
    [key: string]: string;
  } = {};
  if (cssPath) {
    try {
      cssSource = readFileSync(cssPath, 'utf-8');
      cssVars = getCssVariables(cssSource);
      cssAttrs = getAttributes(cssSource);
    } catch {}
  }

  return {
    component,
    stories: storyEntries,
    dodont: doDontEntries,
    mdxCode: result.code,
    frontmatter: result.frontmatter as Record<string, unknown>,
    cssSource,
    cssVars,
    cssAttrs,
    toc: result.toc,
    componentDocs,
    navigation: {
      overviewLink: `/${lang}/components/${component}/overview`,
      codeLink: `/${lang}/components/${component}/code`,
      accessibilityLink: `/${lang}/components/${component}/accessibility`,
    },
    githubLink: `https://github.com/digdir/designsystemet/tree/main/apps/www/app/content/components/${component}/${lang}/${compPage}.mdx`,
  };
};

export default function Components({
  loaderData: { stories, mdxCode, frontmatter, toc, navigation, githubLink },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className={classes.header}>
        <div className={classes.headerUpper}>
          <div className={classes.headerText}>
            <Heading data-size='lg' level={1}>
              {frontmatter.title}
            </Heading>
            <Paragraph>{frontmatter.subtitle}</Paragraph>
          </div>
          <img
            src={'/img/component-previews/' + frontmatter.image}
            alt={frontmatter.title}
            aria-hidden='true'
          />
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
      <TableOfContents
        className={classes.tableOfContents}
        title={frontmatter.title || ''}
        items={toc}
      />

      <div className={cl(classes.content, 'u-rich-text')}>
        {mdxCode ? (
          <MDXComponents
            code={mdxCode}
            components={{
              Story: Story as unknown as ComponentType<unknown>,
              DoDont: DoDontComponent as unknown as ComponentType<unknown>,
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

const Story = ({ story, layout }: LiveComponentProps) => {
  const data =
    useRouteLoaderData<Route.ComponentProps['loaderData']>('components-page');
  if (!data) return null;

  const { stories } = data;

  const foundStory = stories.find((s) => s.name === story);
  if (!foundStory) return <Alert>Story not found: {story}</Alert>;
  return (
    <LiveComponent
      story={`${foundStory.code}\n\nrender(<${foundStory.name} />)`}
      layout={layout}
    />
  );
};

const DoDontComponent = ({
  story,
  children,
  layout,
}: {
  story: string;
  layout?: 'row' | 'column' | 'centered';
  children?: ReactNode;
}) => {
  const data =
    useRouteLoaderData<Route.ComponentProps['loaderData']>('components-page');
  if (!data) return null;

  const { dodont } = data;

  const foundStory = dodont.find((s) => s.name === story);
  if (!foundStory) return <Alert>Do/Dont not found: {story}</Alert>;
  const variant = story.toLowerCase().includes('dont') ? 'dont' : 'do';
  return (
    <DoDont
      layout={layout}
      variant={variant}
      code={`${foundStory.code}\n\nrender(<${foundStory.name} />)`}
    >
      {children}
    </DoDont>
  );
};

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
  const data =
    useRouteLoaderData<Route.ComponentProps['loaderData']>('components-page');
  if (!data) return null;

  const { cssAttrs } = data;

  return cssAttrs ? <CssAttributes vars={cssAttrs} /> : null;
};
