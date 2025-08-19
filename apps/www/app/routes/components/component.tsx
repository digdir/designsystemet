import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/components';
import cl from 'clsx/lite';
import type { ComponentType } from 'react';
import { LiveComponent } from '~/_components/live-component/live-components';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import type { Route } from './+types/component';
import classes from './component.module.css';

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

  return { component, stories: storyEntries, mdxCode, frontmatter };
};

export default function Components({
  loaderData: { stories, mdxCode, frontmatter, component },
}: Route.ComponentProps) {
  const Story = ({ story }: { story: string }) => {
    const foundStory = stories.find((s) => s.name === story);
    if (!foundStory) return <div>Story not found: {story}</div>;
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
        </div>
      </ContentContainer>
    </div>
  );
}
