import { colorMetadata } from '@digdir/designsystemet';
import { Table } from '@digdir/designsystemet-react';

export const ColorInfoTable = () => {
  return (
    <Table
      data-color='neutral'
      zebra
      border
      style={{ margin: '2rem 0' }}
      lang='no'
    >
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell>Bruksområde</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {Object.values(colorMetadata).map((item) => {
          return (
            <Table.Row key={item.name}>
              <Table.Cell>{item.number + '. ' + item.name}</Table.Cell>
              <Table.Cell>{item.description.short}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
