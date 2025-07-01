import { Heading, Table } from '@digdir/designsystemet-react';
import * as R from 'ramda';
import type { HTMLAttributes } from 'react';
import { capitalizeString } from '~/_utils/string-helpers';
import { TokenFontSize } from './token-font-size/token-font-size';

type TokenTableProps = {
  tokens: PreviewToken[];
} & HTMLAttributes<HTMLDivElement>;

type PreviewToken = { variable: string; value: string; path: string[] };

const groupedByPathIndex = (index = 0) =>
  R.groupBy((token: PreviewToken) => token.path[index] || 'rest');

const TypographyRenderer = ({
  groupedTokens,
}: {
  groupedTokens: Partial<Record<string, PreviewToken[]>>;
}) => {
  const valueRenderer = (variable: string, value: string) => {
    if (variable.includes('font-size')) {
      return <TokenFontSize value={value} />;
    }

    return <code>{value}</code>;
  };

  return Object.entries(groupedTokens).map(([path, tokens]) => {
    if (tokens?.length === 0) {
      return null;
    }

    const isTypography = path === 'typography';
    const groupByTypography = isTypography
      ? groupedByPathIndex(1)(tokens || [])
      : ([] as unknown as Partial<Record<string, PreviewToken[]>>);

    return isTypography ? (
      <TypographyRenderer key={path} groupedTokens={groupByTypography} />
    ) : (
      <div key={path}>
        <Heading level={5} data-size='sm'>
          {capitalizeString(path)}
        </Heading>
        <Table data-color='neutral' key={path}>
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

export const TypographyTable = ({ tokens }: TokenTableProps) => {
  const groupedTokens = groupedByPathIndex(0)(tokens);

  return <TypographyRenderer groupedTokens={groupedTokens} />;
};
