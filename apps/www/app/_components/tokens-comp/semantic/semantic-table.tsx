import { Heading, Table } from '@digdir/designsystemet-react';
import { groupBy } from 'ramda';
import type { HTMLAttributes } from 'react';
import { capitalizeString } from '~/_utils/string-helpers';
import type { PreviewToken } from '../types';
import {
  BorderRadius,
  ComputedValue,
  Opacity,
  Shadow,
  Size,
} from './seamantic-previews';

type TokenTableProps = {
  tokens: PreviewToken[];
} & HTMLAttributes<HTMLDivElement>;

const groupedByPathIndex = (index = 0) =>
  groupBy((token: PreviewToken) => token.path[index] || 'rest');

const getValuePreview = (variable: string, value: string) => {
  if (/^--ds-size.*\d$/.test(variable)) {
    return <Size value={value} />;
  }
  if (/^--ds-border-radius(?!.*(scale|base)$)/.test(variable)) {
    return <BorderRadius value={value} />;
  }

  if (/^--ds-shadow/.test(variable)) {
    return <Shadow value={value} />;
  }

  if (/^--ds-opacity/.test(variable)) {
    return <Opacity value={value} />;
  }

  return <code>{value}</code>;
};

const getValueRender = (variable: string, value: string) => {
  if (!/opacity|shadow/.test(variable)) {
    return <ComputedValue value={value} />;
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
        <Table data-color='neutral' zebra>
          <caption>
            <Heading level={5} data-size='sm'>
              {capitalizeString(prettifiedPath)}
            </Heading>
          </caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Navn</Table.HeaderCell>
              <Table.HeaderCell>Verdi</Table.HeaderCell>
              <Table.HeaderCell>Forhåndsvisning</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {tokens?.map(({ variable, value }) => (
              <Table.Row key={variable}>
                <Table.Cell>
                  <code>{variable}</code>
                </Table.Cell>
                <Table.Cell>{getValueRender(variable, value)}</Table.Cell>
                <Table.Cell>{getValuePreview(variable, value)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  });
};
