import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Card, Heading } from '@digdir/designsystemet-react';
import { bundleMDX } from 'mdx-bundler';
import { Link } from 'react-router';
import type { Route } from './+types/monstre';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
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
  const titlesAndUrls: {
    title: string;
    url: string;
  }[] = [];

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
    titlesAndUrls.push({
      title,
      url,
    });
  }

  return { items: titlesAndUrls, lang };
};

export default function Monstre({
  loaderData: { items },
}: Route.ComponentProps) {
  return (
    <div>
      {items.map((item) => {
        return (
          <Card key={item.url}>
            <Card.Block>
              <Heading level={2}>
                <Link to={`${item.url}`}>{item.title}</Link>
              </Heading>
            </Card.Block>
          </Card>
        );
      })}
    </div>
  );
}
