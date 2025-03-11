'use client';
import { colorMetadata } from '@digdir/designsystemet';
import { Table } from '@digdir/designsystemet-react';

export const ColorInfoTable = () => {
  return (
    <Table data-color='neutral' zebra border style={{ margin: '2rem 0' }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell>Bruksområde</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {Object.keys(colorMetadata).map((key) => {
          const item = colorMetadata[key as keyof typeof colorMetadata];
          return (
            <Table.Row key={key}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.description.short}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
