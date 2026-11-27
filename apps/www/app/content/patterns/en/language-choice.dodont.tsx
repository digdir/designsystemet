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
          <Table.HeaderCell>Label</Table.HeaderCell>
          <Table.HeaderCell>Use when</Table.HeaderCell>
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
          <Table.Cell>Users can choose between several languages.</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              Språk/Language
            </Button>
          </Table.Cell>
          <Table.Cell>
            Users can choose between bokmål, nynorsk and other languages.
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
            Users can only choose between bokmål and nynorsk.
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
          <Table.HeaderCell>Label</Table.HeaderCell>
          <Table.HeaderCell>Why not</Table.HeaderCell>
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
          <Table.Cell>English-speaking users will not find it.</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              Bokmål
            </Button>
          </Table.Cell>
          <Table.Cell>
            The written standard should not be used to identify the language
            selector.
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
            The selected language should not be used to identify the language
            selector.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button variant='tertiary' data-size='sm'>
              <LanguageIcon aria-hidden />
              English/Norsk
            </Button>
          </Table.Cell>
          <Table.Cell>
            Does not scale well when more languages are added.
          </Table.Cell>
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
          <Table.HeaderCell>Language options</Table.HeaderCell>
          <Table.HeaderCell>Use when</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Norsk · English · Davvisámegiella</Table.Cell>
          <Table.Cell>
            The website is only available in one Norwegian written standard.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            Bokmål (norsk) · Nynorsk (norsk) · English · Davvisámegiella
          </Table.Cell>
          <Table.Cell>
            The website is available in both bokmål and nynorsk.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            Norsk bokmål · Norsk nynorsk · English · Davvisámegiella
          </Table.Cell>
          <Table.Cell>
            An alternative when the website is available in both bokmål and
            nynorsk.
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
          <Table.HeaderCell>Language options</Table.HeaderCell>
          <Table.HeaderCell>Why not</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Norsk · Engelsk · Nordsamisk</Table.Cell>
          <Table.Cell>
            The language names are translated into the page language.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Bokmål · Nynorsk · English</Table.Cell>
          <Table.Cell>
            The written standards are shown without the language name alongside
            other languages.
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
    { name: 'Norway', flag: nordicCross('#ba0c2f', '#fff', '#00205b') },
    { name: 'Denmark', flag: nordicCross('#c8102e', '#fff') },
    { name: 'Finland', flag: nordicCross('#fff', '#002f6c') },
    { name: 'United Kingdom', flag: unionJack },
    { name: 'Sweden', flag: nordicCross('#006aa7', '#fecc02') },
    { name: 'Germany', flag: germany },
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
          Choose region
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
          <Table.HeaderCell>Page</Table.HeaderCell>
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
          <Table.HeaderCell>URL after changing language</Table.HeaderCell>
          <Table.HeaderCell>Why not</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <code>avsender.no/en</code>
          </Table.Cell>
          <Table.Cell>
            Users end up on the front page and have to find the page again.
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <code>avsender.no/services/grants</code>
          </Table.Cell>
          <Table.Cell>
            The language version has no URL of its own, and cannot be shared or
            linked to.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
