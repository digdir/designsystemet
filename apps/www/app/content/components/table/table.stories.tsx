import { Table } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <Table>
      <caption>Table caption</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
          <Table.HeaderCell>Header 3</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Cell 1</Table.Cell>
          <Table.Cell>Cell 2</Table.Cell>
          <Table.Cell>Cell 3</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell 4</Table.Cell>
          <Table.Cell>Cell 5</Table.Cell>
          <Table.Cell>Cell 6</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.HeaderCell>Footer 1</Table.HeaderCell>
          <Table.HeaderCell>Footer 2</Table.HeaderCell>
          <Table.HeaderCell>Footer 3</Table.HeaderCell>
        </Table.Row>
      </Table.Foot>
    </Table>
  );
};

export const Zebra = () => {
  return (
    <Table zebra>
      <caption>Antall søknader per måned</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Måned</Table.HeaderCell>
          <Table.HeaderCell>2023</Table.HeaderCell>
          <Table.HeaderCell>2024</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope="row">Januar</Table.HeaderCell>
          <Table.Cell>1 230</Table.Cell>
          <Table.Cell>1 450</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope="row">Februar</Table.HeaderCell>
          <Table.Cell>980</Table.Cell>
          <Table.Cell>1 120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope="row">Mars</Table.HeaderCell>
          <Table.Cell>1 150</Table.Cell>
          <Table.Cell>1 300</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const Border = () => {
  return (
    <Table border>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Cell 1</Table.Cell>
          <Table.Cell>Cell 2</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const Hover = () => {
  return (
    <Table hover>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Cell 1</Table.Cell>
          <Table.Cell>Cell 2</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell 3</Table.Cell>
          <Table.Cell>Cell 4</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
