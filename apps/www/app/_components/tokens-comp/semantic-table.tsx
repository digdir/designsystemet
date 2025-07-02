import { Heading, Table } from '@digdir/designsystemet-react';
import { groupBy } from 'ramda';
import type { HTMLAttributes } from 'react';
import { capitalizeString } from '~/_utils/string-helpers';
import { TokenBorderRadius } from './token-border-radius/token-border-radius';
import { TokenShadow } from './token-shadow/token-shadow';
import { TokenSize } from './token-size/token-size';
import type { PreviewToken } from './types';

type TokenTableProps = {
  tokens: PreviewToken[];
} & HTMLAttributes<HTMLDivElement>;

const groupedByPathIndex = (index = 0) =>
  groupBy((token: PreviewToken) => token.path[index] || 'rest');

const valueRenderer = (variable: string, value: string) => {
  if (/^--ds-size.*\d$/.test(variable)) {
    return <TokenSize value={value} />;
  }
  if (/^--ds-border-radius(?!.*(scale|base)$)/.test(variable)) {
    return <TokenBorderRadius value={value} />;
  }

  if (/^--ds-shadow/.test(variable)) {
    return <TokenShadow value={value} />;
  }

  return <code>{value}</code>;
};

export const SemanticTokensTable = ({ tokens }: TokenTableProps) => {
  const groupedTokens = groupedByPathIndex(0)(tokens);

  return Object.entries(groupedTokens).map(([path, tokens]) => {
    if (tokens?.length === 0) {
      return null;
    }

    const prettifiedPath = path.replace(/_/g, ''); // Remove underscores from size tokens

    return (
      <div key={path}>
        <Heading level={5} data-size='sm'>
          {capitalizeString(prettifiedPath)}
        </Heading>
        <Table data-color='neutral'>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Navn</Table.HeaderCell>
              <Table.HeaderCell>Verdi</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {tokens?.map(({ variable, value }) => (
              <Table.Row key={variable}>
                <Table.Cell>
                  <code>{variable}</code>
                </Table.Cell>
                <Table.Cell>{valueRenderer(variable, value)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  });
};
