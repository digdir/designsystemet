import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { Alert, Heading } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type { ComponentType } from 'react';
import type { ComponentDoc } from 'react-docgen-typescript';
import { useRouteLoaderData } from 'react-router';
import {
  CssAttributes,
  getAttributes,
} from '~/_components/css-attributes/css-attributes';
import {
  CssVariables,
  getCssVariables,
} from '~/_components/css-variables/css-variables';
import { EditPageOnGithub } from '~/_components/edit-page-on-github/edit-page-on-github';
import { LiveComponent } from '~/_components/live-component/live-components';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { ReactComponentDocs } from '~/_components/react-component-props/react-component-props';
import { TableOfContents } from '~/_components/table-of-contents/toc';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { getComponentDocs } from '~/_utils/get-react-props';
import type { Route } from './+types/component';
import classes from './component.module.css';

const require = createRequire(import.meta.url);

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { component, lang } = params;

  if (!component) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const componentDocs = getComponentDocs(component);

  const componentDir = join('app', 'content', 'components', component);

  // Extract exported story functions from *.stories.tsx
  const storyEntries: { name: string; code: string; file: string }[] = (() => {
    try {
      if (!existsSync(componentDir)) return [];
      const files = readdirSync(componentDir).filter((f) =>
        f.endsWith('.stories.tsx'),
      );
      if (files.length === 0) return [];

      const extractExportedFunctions = (
        source: string,
      ): { name: string; code: string }[] => {
        const results: { name: string; code: string }[] = [];
        const funcDeclRe =
          /export\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
        const arrowBlockRe =
          /export\s+const\s+([A-Za-z0-9_]+)\s*(?::[^=]+)?=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\};/g;
        const arrowParenRe =
          /export\s+const\s+([A-Za-z0-9_]+)\s*(?::[^=]+)?=\s*\([^)]*\)\s*=>\s*\([\s\S]*?\);/g;

        const pushMatches = (re: RegExp) => {
          for (const m of source.matchAll(re)) {
            const name = m?.[1];
            const code = m?.[0];
            if (name && code) {
              results.push({
                name,
                code: code.replace(/^\s*export\s+/, '').trim(),
              });
            }
          }
        };

        pushMatches(funcDeclRe);
        pushMatches(arrowBlockRe);
        pushMatches(arrowParenRe);
        return results;
      };

      return files.flatMap((file) => {
        const full = join(componentDir, file);
        const src = readFileSync(full, 'utf-8');
        const fns = extractExportedFunctions(src);
        return fns.map((f) => ({ ...f, file }));
      });
    } catch {
      return [];
    }
  })();

  const mdxSource = getFileFromContentDir(
    join('components', component, lang, `${component}.mdx`),
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
    mdxCode: result.code,
    frontmatter: result.frontmatter as Record<string, unknown>,
    cssSource,
    cssVars,
    cssAttrs,
    toc: result.toc,
    componentDocs,
  };
};

export default function Components({
  loaderData: {
    stories,
    mdxCode,
    frontmatter,
    cssVars,
    cssAttrs,
    componentDocs,
    toc,
  },
}: Route.ComponentProps) {
  return (
    <>
      <div className={classes.header}>
        <div className={classes.headerText}>
          <Heading data-size='lg' level={1}>
            {frontmatter.title}
          </Heading>
        </div>
        <img
          src={'/img/component-previews/' + frontmatter.image}
          alt={frontmatter.title}
          aria-hidden='true'
        />
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
            }}
          />
        ) : (
          stories.map((story) => (
            <LiveComponent
              key={story.name}
              code={`${story.code.trim()}\nrender(<${story.name} />)`}
            />
          ))
        )}

        {componentDocs?.length ? (
          <ReactComponentDocs docs={componentDocs as ComponentDoc[]} />
        ) : null}
        {cssVars ? <CssVariables vars={cssVars} /> : null}
        {cssAttrs ? <CssAttributes vars={cssAttrs} /> : null}
        <EditPageOnGithub />
      </div>
    </>
  );
}

const Story = ({ story }: { story: string }) => {
  const data =
    useRouteLoaderData<Route.ComponentProps['loaderData']>('components-page');
  if (!data) return null;

  const { stories } = data;

  const foundStory = stories.find((s) => s.name === story);
  if (!foundStory) return <Alert>Story not found: {story}</Alert>;
  return (
    <LiveComponent
      code={`${foundStory.code}\n\nrender(<${foundStory.name} />)`}
    />
  );
};
