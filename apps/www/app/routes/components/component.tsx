import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/components';
import { LiveEditor, LivePreview, LiveProvider } from 'react-live';
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
  const metadata = readFileSync(
    join(basePath, 'components', component, 'metadata.json'),
    'utf-8',
  );

  return {
    component,
    metadata: JSON.parse(metadata),
  };
};

export default function Components({
  loaderData: { metadata },
}: Route.ComponentProps) {
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
        <LiveComponent />
      </ContentContainer>
    </div>
  );
}
