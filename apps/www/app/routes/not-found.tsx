import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/components';
import { Link, redirect } from 'react-router';
import type { Route } from './+types/not-found';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request?.url || '');
  const lang = url.pathname.split('/')[1];
  if (!lang) {
    return redirect('/no');
  }

  return {
    lang,
  };
};

export default function NotFound({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData;
  return (
    <ContentContainer>
      <div
        lang='no'
        style={{
          display:
            lang === 'no' || (lang !== 'en' && lang !== 'no') ? 'flex' : 'none',
          gap: 'var(--ds-size-2)',
          flexDirection: 'column',
        }}
      >
        <Heading
          level={1}
          data-size='xl'
          style={{
            marginTop: 'var(--ds-size-12)',
          }}
        >
          404 - Fant ikke siden
        </Heading>
        <Paragraph>Siden du leter etter finnes ikke.</Paragraph>
        <Button
          asChild
          style={{
            width: 'fit-content',
          }}
        >
          <Link to='/no'>Gå hjem</Link>
        </Button>
      </div>
      <div
        lang='en'
        style={{
          display:
            lang === 'en' || (lang !== 'en' && lang !== 'no') ? 'flex' : 'none',
          gap: 'var(--ds-size-2)',
          flexDirection: 'column',
        }}
      >
        <Heading
          level={lang === 'en' ? 1 : 2}
          data-size='xl'
          style={{
            marginTop: 'var(--ds-size-12)',
          }}
        >
          404 - Not Found
        </Heading>
        <Paragraph>The page you are looking for can't be found.</Paragraph>
        <Button
          asChild
          style={{
            width: 'fit-content',
          }}
        >
          <Link to='/en'>Go Home</Link>
        </Button>
      </div>
    </ContentContainer>
  );
}
