import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/components';
import { Link, redirect } from 'react-router';
import type { Route } from './+types/not-found';

export const meta: Route.MetaFunction = ({ data }) => {
  const lang = data?.lang || 'no';
  const titles: Record<string, string> = {
    no: 'Feil: Fant ikke siden',
    en: 'Error: Page not found',
  };
  return [
    {
      title: titles[lang] || titles['no'],
    },
  ];
};


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
         Beklager, vi fant ikke siden
        </Heading>
        <Paragraph>Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.</Paragraph>

        <Button
          asChild
          style={{
            width: 'fit-content',
          }}
        >
          <Link to='/no'>Gå til forsiden</Link>
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
          Page not found
        </Heading>
        <Paragraph>The page you are looking for can't be found. It may have been deleted or moved, or there may be an error in the link.</Paragraph>
        <Button
          asChild
          style={{
            width: 'fit-content',
          }}
        >
          <Link to='/en'>Go to the front page</Link>
        </Button>
      </div>
    </ContentContainer>
  );
}
