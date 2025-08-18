import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/components';
import { LiveComponent } from '~/_components/live-component/live-components';
import type { Route } from './+types/component';

const dirname = cwd();

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { component } = params;

  if (!component) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const basePath = join(dirname, './app/content');

  /* load component metadata */
  const componentDir = join(basePath, 'components', component);
  const metadata = readFileSync(join(componentDir, 'metadata.json'), 'utf-8');

  /* extract exported story functions as separate plaintext entries from *.stories.tsx */
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

        // export function Name(...) { ... }
        const funcDeclRe =
          /export\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
        // export const Name = (...) => { ... };
        const arrowBlockRe =
          /export\s+const\s+([A-Za-z0-9_]+)\s*(?::[^=]+)?=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\};/g;
        // export const Name = (...) => ( ... );
        const arrowParenRe =
          /export\s+const\s+([A-Za-z0-9_]+)\s*(?::[^=]+)?=\s*\([^)]*\)\s*=>\s*\([\s\S]*?\);/g;

        const pushMatches = (re: RegExp) => {
          const text = source;
          const matches = Array.from(text.matchAll(re));
          for (const m of matches) {
            const name = m?.[1];
            const code = m?.[0];
            if (name && code) {
              // Remove leading export keyword while preserving the definition
              const codeWithoutExport = code.replace(/^\s*export\s+/, '');
              results.push({ name, code: codeWithoutExport.trim() });
            }
          }
        };

        pushMatches(funcDeclRe);
        pushMatches(arrowBlockRe);
        pushMatches(arrowParenRe);

        return results;
      };

      const collected = files.flatMap((file) => {
        const full = join(componentDir, file);
        const src = readFileSync(full, 'utf-8');
        const fns = extractExportedFunctions(src);
        return fns.map((f) => ({ ...f, file }));
      });

      return collected;
    } catch {
      return [];
    }
  })();

  return {
    component,
    metadata: JSON.parse(metadata),
    stories: storyEntries,
  };
};

export default function Components({
  loaderData: { metadata, stories },
}: Route.ComponentProps) {
  console.log(stories);
  return (
    <div
      style={{
        paddingBlock: 'var(--ds-size-8)',
      }}
    >
      <ContentContainer>
        <Heading data-size='xl' level={1}>
          {metadata.title}
        </Heading>
        <Paragraph>{metadata.description}</Paragraph>
        {stories.map((story) => (
          <LiveComponent
            key={story.name}
            code={`${story.code}\n render(<${story.name} />)`}
          />
        ))}
      </ContentContainer>
    </div>
  );
}
