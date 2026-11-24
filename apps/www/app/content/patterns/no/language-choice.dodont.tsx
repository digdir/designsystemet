import { Button, Paragraph, Table } from '@digdir/designsystemet-react';
import { LanguageIcon } from '@navikt/aksel-icons';

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
