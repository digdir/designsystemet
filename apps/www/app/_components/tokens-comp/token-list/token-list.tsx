import { Table } from '@digdir/designsystemet-react';
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
      return <span>{value}</span>;
  }
};

type TokenTableProps = {
  type?: RenderTypes;
  tokens: PreviewToken[];
} & HTMLAttributes<HTMLDivElement>;

type PreviewToken = { variable: string; value: string };

const TokensTable = ({ tokens, type }: TokenTableProps) => {
  return (
    <Table data-color='neutral'>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          {type === 'color' ? (
            <>
              <Table.HeaderCell>Lys</Table.HeaderCell>
              <Table.HeaderCell>Mørk</Table.HeaderCell>
            </>
          ) : (
            <Table.HeaderCell>Verdi</Table.HeaderCell>
          )}
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
              {type === 'color' ? (
                <>
                  <Table.Cell>
                    <ColorLight colorVariable={value} />
                  </Table.Cell>
                  <Table.Cell>
                    <ColorDark colorVariable={value} />
                  </Table.Cell>
                </>
              ) : (
                <Table.Cell>{renderedValue(value, type)}</Table.Cell>
              )}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export const TokenList = () => {
  return (
    <div className={classes.tokens}>
      {Object.entries(colorTokens).map(([name, tokens]) => {
        return (
          <div key={name as string} className={classes.section}>
            <h3>{capitalizeString(name as string)}</h3>
            <TokensTable type='color' tokens={tokens} />
          </div>
        );
      })}
      {Object.entries(typographyTokens).map(([name, tokens]) => {
        return (
          <div key={name as string} className={classes.section}>
            <h3>{capitalizeString(name as string)}</h3>
            <TokensTable type='typography' tokens={tokens} />
          </div>
        );
      })}
      <div key={'semantic'} className={classes.section}>
        <h3>{capitalizeString('semantic')}</h3>
        <TokensTable tokens={semanticTokens} />
      </div>
    </div>
  );
};
