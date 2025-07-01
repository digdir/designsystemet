import {
  Field,
  Heading,
  Label,
  Search,
  Table,
} from '@digdir/designsystemet-react';
import * as R from 'ramda';
import type { HTMLAttributes } from 'react';
import { useState } from 'react';
import { capitalizeString } from '~/_utils/string-helpers';
import colorTokens from '~/tokens/color.json';
import semanticTokens from '~/tokens/semantic.json';
import typographyTokens from '~/tokens/typography.json';
import { TokenBorderRadius } from '../token-border-radius/token-border-radius';
import { ColorDark, ColorLight } from '../token-color/token-color';
import { TokenShadow } from '../token-shadow/token-shadow';
import { TokenSize } from '../token-size/token-size';
import classes from './token-list.module.css';

export type TokenListProps = {
  type: 'color' | 'typography' | 'shadow' | 'dimension';
  token?: string;
  showThemePicker?: boolean;
  showModeSwitcher: boolean;
  hideValue?: boolean;
};

type RenderTypes = 'color' | 'typography' | 'shadow' | 'dimension';

type TokenTableProps = {
  type?: RenderTypes;
  tokens: PreviewToken[];
} & HTMLAttributes<HTMLDivElement>;

type PreviewToken = { variable: string; value: string; path: string[] };

const groupedByPathIndex = (index = 0) =>
  R.groupBy((token: PreviewToken) => token.path[index] || 'rest');

const ColorTokensTable = ({ tokens }: TokenTableProps) => {
  return (
    <Table data-color='neutral'>
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

const TypographyRenderer = ({
  groupedTokens,
}: {
  groupedTokens: Partial<Record<string, PreviewToken[]>>;
}) =>
  Object.entries(groupedTokens).map(([path, tokens]) => {
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
                <Table.Cell>
                  <code>{value}</code>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  });

const TypographyTable = ({ tokens }: TokenTableProps) => {
  const groupedTokens = groupedByPathIndex(0)(tokens);

  return <TypographyRenderer groupedTokens={groupedTokens} />;
};

const SemanticTokensTable = ({ tokens }: TokenTableProps) => {
  const groupedTokens = groupedByPathIndex(0)(tokens);

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

const tokenSearchFilter = (token: PreviewToken, searchValue: string) =>
  `${token.variable}${token.value}`
    .toLowerCase()
    .includes(searchValue?.toLowerCase() || '');

const filteredRecord = (
  record: Record<string, PreviewToken[]>,
  searchValue: string,
): Record<string, PreviewToken[]> => {
  return Object.entries(record).reduce(
    (acc, [name, tokens]) => {
      const filteredTokens = tokens.filter((token) =>
        tokenSearchFilter(token, searchValue),
      );
      if (filteredTokens.length > 0) {
        acc[name] = filteredTokens;
      }
      return acc;
    },
    {} as Record<string, PreviewToken[]>,
  );
};

export const TokenList = () => {
  const [value, setValue] = useState<string>('');

  const filteredColorTokens = filteredRecord(colorTokens, value);
  const filteredTypographyTokens = filteredRecord(typographyTokens, value);
  const filteredSemanticTokens = semanticTokens.filter((token) =>
    tokenSearchFilter(token, value),
  );

  return (
    <>
      <Field>
        <Label>Søk i design tokens</Label>
        <Search>
          <Search.Input
            aria-label='Søk på variabel navn i CSS for design tokens'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Search.Clear />
          <Search.Button />
        </Search>
      </Field>

      <div className={classes.tokens}>
        <Heading level={3} data-size='lg'>
          Farger
        </Heading>
        {Object.entries(filteredColorTokens).map(([name, tokens]) => {
          return (
            <div key={name as string} className={classes.section}>
              <Heading level={4} data-size='md'>
                {capitalizeString(name as string)}
              </Heading>
              <ColorTokensTable tokens={tokens} />
            </div>
          );
        })}
        <Heading level={3} data-size='lg'>
          Typografi
        </Heading>
        {Object.entries(filteredTypographyTokens).map(([name, tokens]) => {
          return (
            <div key={name as string} className={classes.section}>
              <Heading level={4} data-size='md'>
                {capitalizeString(name as string)}
              </Heading>
              <TypographyTable type='typography' tokens={tokens} />
            </div>
          );
        })}
        <Heading level={3} data-size='lg'>
          Semantiske
        </Heading>
        <div key={'semantic'} className={classes.section}>
          <SemanticTokensTable tokens={filteredSemanticTokens} />
        </div>
      </div>
    </>
  );
};
