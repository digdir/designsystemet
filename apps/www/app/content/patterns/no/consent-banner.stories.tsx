import {
  Button,
  Checkbox,
  Fieldset,
  Heading,
  Link,
  Paragraph,
  SkipLink,
} from '@digdir/designsystemet-react';

export const ConsentBanner = () => {
  return (
    <>
      <section aria-labelledby='samtykkebanner-tittel'>
        <Heading
          id='samtykkebanner-tittel'
          data-size='md'
          style={{ marginBottom: 'var(--ds-size-2)' }}
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
          <Button name='action' type='submit'>
            Ja
          </Button>
          <Button name='action' type='submit'>
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
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
    </>
  );
};

export const ConsentBannerCheckboxes = () => {
  return (
    <>
      <section aria-labelledby='samtykkebanner-flere-valg-tittel'>
        <form method='post' action='/api/consent'>
          <Fieldset>
            <Fieldset.Legend>
              <Heading
                id='samtykkebanner-flere-valg-tittel'
                data-size='md'
                style={{ marginBottom: 'var(--ds-size-2)' }}
              >
                Hva får vi samle informasjon om?
              </Heading>
            </Fieldset.Legend>
            <Fieldset.Description>
              Informasjonen hjelper oss å forbedre nettsiden og løse problemer
              raskere.
            </Fieldset.Description>
            <Checkbox
              label='Hvordan nettsiden brukes'
              name='consent'
              value='usage'
            />
            <Checkbox
              label='Tekniske feil som oppstår'
              name='consent'
              value='technical-errors'
            />
          </Fieldset>
          <Paragraph
            style={{
              marginTop: 'var(--ds-size-5)',
            }}
          >
            Du kan når som helst endre valget ditt nederst på siden.{' '}
            <Link href='#mer-om-hva-vi-lagrer' style={{ color: 'inherit' }}>
              Mer om hva vi lagrer og hvorfor.
            </Link>
          </Paragraph>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--ds-size-4)',
              marginTop: 'var(--ds-size-5)',
            }}
          >
            <Button name='action' type='submit' value='save'>
              Lagre valg
            </Button>
            <Button name='action' type='submit' value='approve-all'>
              Godta alle
            </Button>
            <Button name='action' type='submit' value='decline-all'>
              Avslå alle
            </Button>
          </div>
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
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
    </>
  );
};
