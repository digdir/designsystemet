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
      <section aria-labelledby='samtykkebanner__tittel'>
        <Heading
          id='samtykkebanner__tittel'
          data-size='md'
          style={{ marginBottom: 'var(--ds-size-4)' }}
        >
          Får vi samle informasjon om hvordan nettsiden brukes?
        </Heading>
        <Paragraph>
          Hvis du svarer ja, lagrer og analyserer vi informasjon som hjelper oss
          å forbedre nettsiden. Du kan når som helst endre valget ditt nederst
          på siden.{' '}
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
          <Button className='consent-banner-button' name='action' type='submit'>
            Ja
          </Button>
          <Button className='consent-banner-button' name='action' type='submit'>
            Nei
          </Button>
        </form>
        <Paragraph
          data-size='sm'
          style={{
            marginTop: 'var(--ds-size-8)',
          }}
        >
          <Link href='#nodvendig-informasjon' style={{ color: 'inherit' }}>
            Vi lagrer også nødvendig informasjon
          </Link>{' '}
          som ikke kan velges bort. Dette gjør at nettsiden fungerer og er
          trygg.
        </Paragraph>
      </section>
      <SkipLink className='consent-banner-skip-link' href='#main'>
        Hopp til hovedinnhold
      </SkipLink>
    </>
  );
};
