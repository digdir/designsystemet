import { Heading, Table } from '@digdir/designsystemet-react';
import type { HTMLAttributes } from 'react';
import { capitalizeString } from '~/_utils/string-helpers';
import type { PreviewToken } from '../types';
import { ColorDark, ColorLight } from './color-previews';

type TokenTableProps = {
  tokens: PreviewToken[];
  title: string;
} & HTMLAttributes<HTMLDivElement>;

export const ColorTokensTable = ({ tokens, title }: TokenTableProps) => {
  return (
    <Table data-color='neutral'>
      <caption>
        <Heading level={4} data-size='md'>
          {capitalizeString(title)}
        </Heading>
      </caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell>Lys</Table.HeaderCell>
          <Table.HeaderCell>Mørk</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tokens.map((token) => {
          const name = token.variable;
          const value = token.value;

          return (
            <Table.Row key={name}>
              <Table.Cell>
                <code>{name}</code>
              </Table.Cell>
              <Table.Cell>
                <ColorLight colorVariable={value} />
              </Table.Cell>
              <Table.Cell>
                <ColorDark colorVariable={value} />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
