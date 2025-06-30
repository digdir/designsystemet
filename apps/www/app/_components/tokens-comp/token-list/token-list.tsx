import { Search, Table } from '@digdir/designsystemet-react';
import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { capitalizeString } from '~/_utils/string-helpers';
import colorTokens from '~/tokens/color.json';
import semanticTokens from '~/tokens/semantic.json';
import typographyTokens from '~/tokens/typography.json';
import { ColorDark, ColorLight } from '../token-color/token-color';
import classes from './token-list.module.css';

export type TokenListProps = {
  type: 'color' | 'typography' | 'shadow' | 'dimension';
  token?: string;
  showThemePicker?: boolean;
  showModeSwitcher: boolean;
  hideValue?: boolean;
};

const ComputedValue = ({ value }: { value: string }) => {
  const [computedValue, setComputedValue] = useState<string>('');

  useEffect(() => {
    if (!document) return;

    const elm = document.createElement('div');
    elm.style.cssText = `width: ${value}; height: ${value};`;
    document.body.appendChild(elm);
    const computedValue = getComputedStyle(elm).width;
    document.body.removeChild(elm);

    setComputedValue(computedValue);
  }, [value]);

  const getRoundValue = (value: string) => {
    const [value_] = value.split('px');
    return Math.round(Number(value_)) + 'px';
  };

  return <>{getRoundValue(computedValue)}</>;
};

type RenderTypes = 'color' | 'typography' | 'shadow' | 'dimension';

const renderedValue = (value: string, type?: RenderTypes) => {
  switch (type) {
    case 'dimension':
      return <ComputedValue value={value} />;
    default:
      return <code>{value}</code>;
  }
};

type TokenTableProps = {
  type?: RenderTypes;
  tokens: PreviewToken[];
} & HTMLAttributes<HTMLDivElement>;

type PreviewToken = { variable: string; value: string };

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

const TokensTable = ({ tokens, type }: TokenTableProps) => {
  return (
    <Table data-color='neutral'>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>

          <Table.HeaderCell>Verdi</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tokens.map(({ variable, value }) => (
          <Table.Row key={variable}>
            <Table.Cell>
              <code>{variable}</code>
            </Table.Cell>
            <Table.Cell>{renderedValue(value, type)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const SemanticTokensTable = ({ tokens, type }: TokenTableProps) => {
  const filteredTokens = tokens.sort((a) => {
    return a.variable.startsWith('--ds-size') ? -1 : 1;
  });

  return (
    <Table data-color='neutral'>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>

          <Table.HeaderCell>Verdi</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {filteredTokens.map(({ variable, value }) => (
          <Table.Row key={variable}>
            <Table.Cell>
              <code>{variable}</code>
            </Table.Cell>
            <Table.Cell>{renderedValue(value, type)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const tokenSearchFilter = (token: PreviewToken, searchValue: string) =>
  token.variable.toLowerCase().includes(searchValue?.toLowerCase() || '');

const filteredRecord = (
  record: Record<string, PreviewToken[]>,
  searchValue?: string,
): Record<string, PreviewToken[]> => {
  return Object.entries(record).reduce(
    (acc, [name, tokens]) => {
      const filteredTokens = tokens.filter((token) =>
        token.variable.toLowerCase().includes(searchValue?.toLowerCase() || ''),
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
  const [searchValue, setValue] = useState<string>('');

  const filteredColorTokens = filteredRecord(colorTokens, searchValue);
  const filteredTypographyTokens = filteredRecord(
    typographyTokens,
    searchValue,
  );
  const filteredSemanticTokens = semanticTokens.filter((token) =>
    tokenSearchFilter(token, searchValue),
  );

  return (
    <>
      <Search>
        <Search.Input
          aria-label='Søk'
          value={searchValue}
          onChange={(e) => setValue(e.target.value)}
        />
        <Search.Clear />
        <Search.Button />
      </Search>
      <div className={classes.tokens}>
        {Object.entries(filteredColorTokens).map(([name, tokens]) => {
          return (
            <div key={name as string} className={classes.section}>
              <h3>{capitalizeString(name as string)}</h3>
              <ColorTokensTable tokens={tokens} />
            </div>
          );
        })}
        {Object.entries(filteredTypographyTokens).map(([name, tokens]) => {
          return (
            <div key={name as string} className={classes.section}>
              <h3>{capitalizeString(name as string)}</h3>
              <TokensTable type='typography' tokens={tokens} />
            </div>
          );
        })}
        <div key={'semantic'} className={classes.section}>
          <h3>{capitalizeString('semantic')}</h3>
          <SemanticTokensTable tokens={filteredSemanticTokens} />
        </div>
      </div>
    </>
  );
};
