import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/components';
import cl from 'clsx/lite';
import type { ComponentType } from 'react';
import { CssVariables } from '~/_components/css-variables/css-variables';
import { LiveComponent } from '~/_components/live-component/live-components';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import type { Route } from './+types/component';
import classes from './component.module.css';

const require = createRequire(import.meta.url);

function getCssVariables(css: string) {
  const res: { [key: string]: string } = {};

  // temporarily remove inline strings, as they may contain ; and } characters
  // and thus ruin the matching for property declarations
  const stringsRemovedFromCss = Array.from(css.matchAll(/"[^"]*"/g)).map(
    (x) => x[0],
  );
  const cssWithRemovedStrings = stringsRemovedFromCss.reduce(
    (prev, curr, idx) => prev.replace(curr, `<placeholder-${idx}>`),
    css,
  );
  // get all --dsc-* property declarations
  const cssVars = Array.from(
    cssWithRemovedStrings.matchAll(/(?<!var\()(--dsc-[^;}]+)[;}]/g),
  ).map((matches) => matches[1]);

  /* Iterate over the CSS properties */
  for (const declaration of cssVars) {
    const [name, value] = declaration.split(':');
    // Choose the earliest declaration of the property.
    // We assume later declarations are part of a sub-selector.
    if (!res[name]) {
      // Return the original inline string from the value, if it was removed earlier
      const valueWithOriginalString = value.replace(
        /<placeholder-(\d+)>/,
        (_, p1: string) => stringsRemovedFromCss[parseInt(p1)],
      );
      res[name] = valueWithOriginalString;
    }
  }

  return res;
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { component, lang } = params;

  if (!component) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

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

  let mdxCode: string | undefined;
  let frontmatter: Record<string, unknown> | undefined;
  try {
    const mdxSource = getFileFromContentDir(
      join('components', component, lang, `${component}.mdx`),
    );

    if (mdxSource) {
      const result = await generateFromMdx(mdxSource);
      mdxCode = result.code;
      if (result.frontmatter && typeof result.frontmatter === 'object') {
        frontmatter = result.frontmatter as Record<string, unknown>;
      }
    }
  } catch {
    // ignore MDX errors and fall back to default rendering
  }

  // Resolve raw CSS for this component from @digdir/designsystemet-css

  let cssPath: string | undefined;

  try {
    cssPath = require.resolve(`@digdir/designsystemet-css/${component}.css`);
  } catch {}

  let cssSource: string | undefined;
  let cssVars: {
    [key: string]: string;
  } = {};
  if (cssPath) {
    try {
      cssSource = readFileSync(cssPath, 'utf-8');
      cssVars = getCssVariables(cssSource);
    } catch {}
  }

  return {
    component,
    stories: storyEntries,
    mdxCode,
    frontmatter,
    cssSource,
    cssVars,
  };
};

export default function Components({
  loaderData: { stories, mdxCode, frontmatter, component, cssVars },
}: Route.ComponentProps) {
  const Story = ({ story }: { story: string }) => {
    const foundStory = stories.find((s) => s.name === story);
    if (!foundStory) return <Alert>Story not found: {story}</Alert>;
    return (
      <LiveComponent
        code={`${foundStory.code}\n render(<${foundStory.name} />)`}
      />
    );
  };

  const title =
    typeof frontmatter?.title === 'string' && frontmatter.title
      ? (frontmatter.title as string)
      : component;
  const desc =
    typeof frontmatter?.description === 'string' && frontmatter.description
      ? (frontmatter.description as string)
      : undefined;

  return (
    <div style={{ paddingBlock: 'var(--ds-size-8)' }}>
      <ContentContainer>
        <div className={cl(classes.content, 'u-rich-text')}>
          <Heading data-size='xl' level={1}>
            {title}
          </Heading>
          {desc ? <Paragraph>{desc}</Paragraph> : null}
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
                code={`${story.code}\n render(<${story.name} />)`}
              />
            ))
          )}
          {cssVars ? <CssVariables vars={cssVars} /> : null}
        </div>
      </ContentContainer>
    </div>
  );
}
