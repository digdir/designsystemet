import {
  Button,
  Divider,
  Paragraph,
  Table,
} from '@digdir/designsystemet-react';
import { CheckmarkIcon, GlobeIcon, LanguageIcon } from '@navikt/aksel-icons';

export const DoLabel = () => {
  return (
    <Table data-size='sm' style={{ width: '100%' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Ledetekst</Table.HeaderCell>
          <Table.HeaderCell>Bruk når</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              Language
            </Button>
          </Table.Cell>
          <Table.Cell>Brukerne kan velge mellom flere språk.</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              Språk/Language
            </Button>
          </Table.Cell>
          <Table.Cell>
            Brukerne kan velge mellom bokmål, nynorsk og andre språk.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              Målform
            </Button>
          </Table.Cell>
          <Table.Cell>
            Brukerne bare kan velge mellom bokmål og nynorsk.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const DontLabel = () => {
  return (
    <Table data-size='sm' style={{ width: '100%' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Ledetekst</Table.HeaderCell>
          <Table.HeaderCell>Hvorfor ikke</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              Språk
            </Button>
          </Table.Cell>
          <Table.Cell>Engelskspråklige brukere finner det ikke.</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              Bokmål
            </Button>
          </Table.Cell>
          <Table.Cell>
            Målformen skal ikke brukes for å identifisere språkvelgeren.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              Engelsk
            </Button>
          </Table.Cell>
          <Table.Cell>
            Det valgte språket skal ikke brukes for å identifisere
            språkvelgeren.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              English/Norsk
            </Button>
          </Table.Cell>
          <Table.Cell>Skalerer dårlig når det kommer flere språk.</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const DoLanguageNames = () => {
  return (
    <Table data-size='sm' style={{ width: '100%' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Språkvalg</Table.HeaderCell>
          <Table.HeaderCell>Bruk når</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Norsk · English · Davvisámegiella</Table.Cell>
          <Table.Cell>Nettstedet finnes bare på én målform.</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            Bokmål (norsk) · Nynorsk (norsk) · English · Davvisámegiella
          </Table.Cell>
          <Table.Cell>Nettstedet finnes på både bokmål og nynorsk.</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            Norsk bokmål · Norsk nynorsk · English · Davvisámegiella
          </Table.Cell>
          <Table.Cell>
            Et alternativ når nettstedet finnes på både bokmål og nynorsk.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const DontLanguageNames = () => {
  return (
    <Table data-size='sm' style={{ width: '100%' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Språkvalg</Table.HeaderCell>
          <Table.HeaderCell>Hvorfor ikke</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Norsk · Engelsk · Nordsamisk</Table.Cell>
          <Table.Cell>Språknavnene er oversatt til sidens språk.</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Bokmål · Nynorsk · English</Table.Cell>
          <Table.Cell>
            Målformene står uten språknavn sammen med andre språk.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const DoFlagsForCountry = () => {
  const nordicCross = (background: string, cross: string, inner?: string) => (
    <svg
      aria-hidden
      viewBox='0 0 22 16'
      width='1.5em'
      height='1.1em'
      style={{
        boxShadow: '0 0 0 1px var(--ds-color-neutral-border-subtle)',
      }}
    >
      <rect width='22' height='16' fill={background} />
      <rect x='6' width='4' height='16' fill={cross} />
      <rect y='6' width='22' height='4' fill={cross} />
      {inner && <rect x='7' width='2' height='16' fill={inner} />}
      {inner && <rect y='7' width='22' height='2' fill={inner} />}
    </svg>
  );

  const unionJack = (
    <svg
      aria-hidden
      viewBox='0 0 60 30'
      width='1.5em'
      height='1.1em'
      preserveAspectRatio='none'
    >
      <rect width='60' height='30' fill='#012169' />
      <path d='M0 0l60 30M60 0L0 30' stroke='#fff' strokeWidth='6' />
      <path d='M0 0l60 30M60 0L0 30' stroke='#c8102e' strokeWidth='2' />
      <path d='M30 0v30M0 15h60' stroke='#fff' strokeWidth='10' />
      <path d='M30 0v30M0 15h60' stroke='#c8102e' strokeWidth='6' />
    </svg>
  );

  const germany = (
    <svg
      aria-hidden
      viewBox='0 0 5 3'
      width='1.5em'
      height='1.1em'
      preserveAspectRatio='none'
    >
      <rect width='5' height='1' fill='#000' />
      <rect y='1' width='5' height='1' fill='#dd0000' />
      <rect y='2' width='5' height='1' fill='#ffce00' />
    </svg>
  );

  const countries = [
    { name: 'Norge', flag: nordicCross('#ba0c2f', '#fff', '#00205b') },
    { name: 'Danmark', flag: nordicCross('#c8102e', '#fff') },
    { name: 'Finland', flag: nordicCross('#fff', '#002f6c') },
    { name: 'Storbritannia', flag: unionJack },
    { name: 'Sverige', flag: nordicCross('#006aa7', '#fecc02') },
    { name: 'Tyskland', flag: germany },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
        gap: 'var(--ds-size-8)',
        alignItems: 'start',
      }}
    >
      <div style={{ display: 'grid', gap: 'var(--ds-size-2)' }}>
        <Paragraph
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-size-2)',
            fontWeight: 500,
          }}
        >
          <GlobeIcon aria-hidden fontSize='1.5em' />
          Velg region
        </Paragraph>
        <Divider />
        {countries.map(({ name, flag }) => (
          <Paragraph
            key={name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-size-2)',
            }}
          >
            {flag}
            {name}
          </Paragraph>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 'var(--ds-size-2)' }}>
        <Paragraph
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-size-2)',
            fontWeight: 500,
          }}
        >
          <LanguageIcon aria-hidden fontSize='1.5em' />
          Language
        </Paragraph>
        <Divider />
        {['Norsk', 'Dansk', 'Suomi', 'English', 'Svenska', 'Deutsch'].map(
          (name) => (
            <Paragraph
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--ds-size-2)',
              }}
            >
              <CheckmarkIcon
                aria-hidden
                fontSize='1.5em'
                style={{ visibility: name === 'Norsk' ? 'visible' : 'hidden' }}
              />
              {name}
            </Paragraph>
          ),
        )}
      </div>
    </div>
  );
};

export const DontFlagsForLanguage = () => {
  const nordicCross = (background: string, cross: string, inner?: string) => (
    <svg
      aria-hidden
      viewBox='0 0 22 16'
      width='1.5em'
      height='1.1em'
      style={{
        boxShadow: '0 0 0 1px var(--ds-color-neutral-border-subtle)',
      }}
    >
      <rect width='22' height='16' fill={background} />
      <rect x='6' width='4' height='16' fill={cross} />
      <rect y='6' width='22' height='4' fill={cross} />
      {inner && <rect x='7' width='2' height='16' fill={inner} />}
      {inner && <rect y='7' width='22' height='2' fill={inner} />}
    </svg>
  );

  const unionJack = (
    <svg
      aria-hidden
      viewBox='0 0 60 30'
      width='1.5em'
      height='1.1em'
      preserveAspectRatio='none'
    >
      <rect width='60' height='30' fill='#012169' />
      <path d='M0 0l60 30M60 0L0 30' stroke='#fff' strokeWidth='6' />
      <path d='M0 0l60 30M60 0L0 30' stroke='#c8102e' strokeWidth='2' />
      <path d='M30 0v30M0 15h60' stroke='#fff' strokeWidth='10' />
      <path d='M30 0v30M0 15h60' stroke='#c8102e' strokeWidth='6' />
    </svg>
  );

  const germany = (
    <svg
      aria-hidden
      viewBox='0 0 5 3'
      width='1.5em'
      height='1.1em'
      preserveAspectRatio='none'
    >
      <rect width='5' height='1' fill='#000' />
      <rect y='1' width='5' height='1' fill='#dd0000' />
      <rect y='2' width='5' height='1' fill='#ffce00' />
    </svg>
  );

  const languages = [
    { name: 'Norsk', flag: nordicCross('#ba0c2f', '#fff', '#00205b') },
    { name: 'Dansk', flag: nordicCross('#c8102e', '#fff') },
    { name: 'Suomi', flag: nordicCross('#fff', '#002f6c') },
    { name: 'English', flag: unionJack },
    { name: 'Svenska', flag: nordicCross('#006aa7', '#fecc02') },
    { name: 'Deutsch', flag: germany },
  ];

  return (
    <div style={{ display: 'grid', gap: 'var(--ds-size-2)' }}>
      <Paragraph
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-size-2)',
          fontWeight: 500,
        }}
      >
        <LanguageIcon aria-hidden fontSize='1.5em' />
        Language
      </Paragraph>
      <Divider />
      {languages.map(({ name, flag }) => (
        <Paragraph
          key={name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-size-2)',
          }}
        >
          {flag}
          {name}
        </Paragraph>
      ))}
    </div>
  );
};

export const DoLanguageUrls = () => {
  return (
    <Table data-size='sm' style={{ width: '100%' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Side</Table.HeaderCell>
          <Table.HeaderCell>URL</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Norsk</Table.Cell>
          <Table.Cell>
            <code>avsender.no/no/services/grants</code>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>English</Table.Cell>
          <Table.Cell>
            <code>avsender.no/en/services/grants</code>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const DontLanguageUrls = () => {
  return (
    <Table data-size='sm' style={{ width: '100%' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>URL etter språkbytte</Table.HeaderCell>
          <Table.HeaderCell>Hvorfor ikke</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <code>avsender.no/en</code>
          </Table.Cell>
          <Table.Cell>
            Brukerne havner på forsiden og må finne siden på nytt.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <code>avsender.no/services/grants</code>
          </Table.Cell>
          <Table.Cell>
            Språkversjonen har ingen egen URL, og kan ikke deles eller lenkes
            til.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
