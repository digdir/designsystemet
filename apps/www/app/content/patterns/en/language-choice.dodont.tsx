import { Button, Paragraph, Table } from '@digdir/designsystemet-react';
import { LanguageIcon } from '@navikt/aksel-icons';

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
    <div style={{ display: 'grid', gap: 'var(--ds-size-2)' }}>
      <Paragraph>Norsk · English · Davvisámegiella</Paragraph>
      <Paragraph>
        Bokmål (norsk) · Nynorsk (norsk) · English · Davvisámegiella
      </Paragraph>
      <Paragraph>
        Norsk bokmål · Norsk nynorsk · English · Davvisámegiella
      </Paragraph>
    </div>
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
