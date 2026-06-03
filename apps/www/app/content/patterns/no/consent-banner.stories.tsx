import {
  Button,
  Heading,
  Link,
  Paragraph,
  SkipLink,
} from '@digdir/designsystemet-react';

export const ConsentBanner = () => {
  return (
    <>
      <section
        aria-labelledby='consent-banner-title'
        style={{
          background: '#0062ba',
          color: 'white',
          padding: 'var(--ds-size-10) var(--ds-size-8)',
        }}
      >
        <div style={{ maxWidth: '72rem' }}>
          <Heading
            id='consent-banner-title'
            data-size='lg'
            style={{ marginBottom: 'var(--ds-size-4)' }}
          >
            Får vi samle informasjon om hvordan nettsiden brukes?
          </Heading>
          <Paragraph
            style={{
              color: 'inherit',
              fontSize: '1.25rem',
              maxWidth: '68rem',
            }}
          >
            Hvis du svarer ja, lagrer og analyserer vi informasjon som hjelper
            oss å forbedre nettsiden. Du kan når som helst endre valget ditt
            nederst på siden.{' '}
            <Link href='#mer-om-hva-vi-lagrer' style={{ color: 'inherit' }}>
              Mer om hva vi lagrer og hvorfor.
            </Link>
          </Paragraph>
          <form
            method='post'
            action='/api/consent'
            style={{
              display: 'flex',
              gap: 'var(--ds-size-4)',
              marginTop: 'var(--ds-size-5)',
            }}
          >
            <Button
              className='consent-banner-button'
              data-color='neutral'
              data-size='md'
              name='action'
              type='submit'
              value='all'
            >
              Ja
            </Button>
            <Button
              className='consent-banner-button'
              data-color='neutral'
              data-size='md'
              name='action'
              type='submit'
              value='required'
            >
              Nei
            </Button>
          </form>
          <Paragraph
            style={{
              color: 'inherit',
              fontSize: '1.125rem',
              marginTop: 'var(--ds-size-8)',
            }}
          >
            <Link href='#nodvendig-informasjon' style={{ color: 'inherit' }}>
              Vi lagrer også nødvendig informasjon
            </Link>{' '}
            som ikke kan velges bort. Dette gjør at nettsiden fungerer og er
            trygg.
          </Paragraph>
        </div>
      </section>
      <style>
        {`
          .consent-banner-button {
            background-color: rgb(255 255 255 / 100%);
            color: rgb(0 0 0 / 100%);
          }

          .consent-banner-button:hover {
            background-color: rgb(255 255 255 / 70%);
          }

          .consent-banner-skip-link:focus {
            width: 100%;
          }
        `}
      </style>
      <SkipLink className='consent-banner-skip-link' href='#main'>
        Hopp til hovedinnhold
      </SkipLink>
    </>
  );
};
