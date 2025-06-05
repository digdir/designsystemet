import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/rr-components';
import { Link, redirect } from 'react-router';
import type { Route } from './+types/not-found';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request?.url || '');
  const lang = url.pathname.split('/')[1];
  if (!lang) {
    return redirect('/no');
  }
};

export default function NotFound() {
  return (
    <ContentContainer lang='en'>
      <Heading
        level={1}
        data-size='xl'
        style={{
          marginTop: 'var(--ds-size-12)',
        }}
      >
        404 - Not Found
      </Heading>
      <Paragraph>The page you are looking for does not exist.</Paragraph>
      <Button
        asChild
        style={{
          width: 'fit-content',
        }}
      >
        <Link to='/no'>Go Home</Link>
      </Button>
    </ContentContainer>
  );
}
