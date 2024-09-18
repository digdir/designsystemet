'use client';
import {
  Dropdown,
  Heading,
  Link,
  Paragraph,
  Table,
} from '@digdir/designsystemet-react';
import { getColorNameFromNumber } from '@digdir/designsystemet/color';
import { ClipboardButton } from '@repo/components';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import type { TransformedToken as Token } from 'style-dictionary';

import * as tokensDark from '../../../tokens/dark';
import * as tokensLight from '../../../tokens/light';
import { capitalizeString } from '../../../utils/StringHelpers';
import { TokenColor, getColorWeight } from '../TokenColor/TokenColor';
import { TokenFontSize } from '../TokenFontSize/TokenFontSize';
import { TokenShadow } from '../TokenShadow/TokenShadow';
import { TokenSize } from '../TokenSize/TokenSize';

import { TokenBorderRadius } from '../TokenBorderRadius/TokenBorderRadius';
import classes from './TokenList.module.css';

type TokenListProps = {
  type: 'color' | 'typography' | 'shadow' | 'dimension';
  token?: string;
  showThemePicker?: boolean;
  showModeSwitcher: boolean;
  hideValue?: boolean;
};

type CardColumnType = 2 | 3;
type BrandType = 'digdir' | 'altinn' | 'tilsynet' | 'portal';

type TokenTableProps = {
  tokens: [string, Token[]][];
} & HTMLAttributes<HTMLDivElement>;

const TokensTable = ({ tokens }: TokenTableProps) => {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell>Rem</Table.HeaderCell>
          <Table.HeaderCell>Px (16px)</Table.HeaderCell>
          <Table.HeaderCell>Visualisering</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {tokens.map(([, tokens]) => {
          return tokens.map((token) => {
            const value = token.$value as string;
            const pxSize = /\b\d+px\b/.test(value)
              ? value
              : `${parseFloat(value) * 16}px`;
            const isBorderRadius = token.path.includes('border-radius');

            return (
              <Table.Row key={token.name}>
                <Table.Cell>
                  <ClipboardButton
                    title='Kopier CSS variabel'
                    text={token.name}
                    value={token.name}
                  />
                </Table.Cell>
                <Table.Cell>{token.$value}</Table.Cell>
                <Table.Cell>{pxSize}</Table.Cell>
                <Table.Cell>
                  {isBorderRadius ? (
                    <TokenBorderRadius value={pxSize} />
                  ) : (
                    <TokenSize value={pxSize} />
                  )}
                </Table.Cell>
              </Table.Row>
            );
          });
        })}
      </Table.Body>
    </Table>
  );
};

type TokenCardsProps = {
  tokens: [string, Token[]][];
  cols?: number;
  hideValue: TokenListProps['hideValue'];
  type: TokenListProps['type'];
};

const TokenCards = ({ tokens, cols, hideValue, type }: TokenCardsProps) => {
  return tokens.map(([group, tokens]) => {
    return (
      <div key={group}>
        <Heading size='xs' level={4} className={classes.title}>
          {capitalizeString(group)}
        </Heading>
        <div className={cl(classes.group)}>
          <div
            className={cl(classes.cards, {
              [classes.cards2]: cols === 2,
            })}
          >
            {tokens.map((token) => (
              <TokenCard
                token={token}
                key={token.name}
                hideValue={hideValue}
                type={type}
              />
            ))}
          </div>
        </div>
      </div>
    );
  });
};

type TokenCardProps = {
  token: Token;
  hideValue: TokenListProps['hideValue'];
  type: TokenListProps['type'];
} & HTMLAttributes<HTMLDivElement>;

const TokenCard = ({ token, type, hideValue, ...rest }: TokenCardProps) => {
  const val = token.$value as string;
  const title = token.path
    .slice(token.path.length - 1, token.path.length)
    .toString();

  const weight = getColorWeight(token.original.$value as string);

  return (
    <div className={classes.card} {...rest}>
      <div className={classes.preview}>
        {type === 'color' && <TokenColor value={val} token={token} />}
        {type === 'typography' && <TokenFontSize value={val} />}
        {type === 'shadow' && <TokenShadow value={val} />}
      </div>

      <div className={classes.textContainer}>
        <Heading level={5} size='2xs' className={classes.name}>
          {weight ? getColorNameFromNumber(weight) : capitalizeString(title)}
          &nbsp;
          <ClipboardButton
            title='Kopier CSS variabel'
            text='CSS'
            value={token.name}
          />
        </Heading>
        {!hideValue && <div className={classes.value}>{token.$value}</div>}
      </div>
    </div>
  );
};

const mapTokens = (tokens: Token[]): [string, Token[]][] =>
  Array.from(
    tokens.reduce((acc, token) => {
      const path = token.path.length > 2 ? token.path.slice(1, -1) : token.path;
      const key = path.toString().replace(/,/g, ' ').trim();
      const tokens = acc.get(key);

      !tokens ? acc.set(key, [token]) : acc.set(key, [...tokens, token]);

      return acc;
    }, new Map<string, Token[]>()),
  );

const TokenList = ({
  showThemePicker,
  showModeSwitcher,
  type = 'color',
  hideValue = false,
}: TokenListProps) => {
  const [brand, setBrand] = useState<BrandType>('digdir');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [cardColumns, setCardColumns] = useState<CardColumnType>(3);

  const tokens = mode === 'light' ? tokensLight : tokensDark;

  useEffect(() => {
    setCardColumns(type === 'color' ? 3 : 2);
  }, [type]);

  const brandTypeTokens = tokens[brand][type] as unknown as Token[];

  const sections = Array.from(
    brandTypeTokens.reduce((acc, token) => {
      const [section] = token.path;
      acc.add(section);
      return acc;
    }, new Set<string>()),
  );

  const sectionedTokens = Array.from(
    sections.map((section) => [
      section,
      mapTokens(brandTypeTokens.filter((token) => token.path[0] === section)),
    ]),
  );

  return (
    <div className={classes.tokens}>
      <div className={classes.package}>
        <Link href='https://www.npmjs.com/package/@digdir/designsystemet-theme'>
          <img
            src='https://img.shields.io/npm/v/@digdir/designsystemet-theme?label=latest%20release&color=0051be'
            alt='Latest release on npm'
            className={classes.npmShield}
          />
        </Link>
        <Paragraph size='sm'>@digdir/designsystemet-theme</Paragraph>
      </div>
      {(showThemePicker || showModeSwitcher) && (
        <div className={classes.toggleGroup}>
          {showThemePicker && (
            <Dropdown.Context>
              <Dropdown.Trigger variant='secondary'>
                Brand: {capitalizeString(brand)}
              </Dropdown.Trigger>
              <Dropdown>
                <Dropdown.Item onClick={() => setBrand('digdir')}>
                  Digdir
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setBrand('altinn')}>
                  Altinn
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setBrand('tilsynet')}>
                  Tilsynet
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setBrand('portal')}>
                  Brreg
                </Dropdown.Item>
              </Dropdown>
            </Dropdown.Context>
          )}
          {showModeSwitcher && (
            <Dropdown.Context>
              <Dropdown.Trigger variant='secondary'>
                Mode: {capitalizeString(mode)}
              </Dropdown.Trigger>
              <Dropdown>
                <Dropdown.Item onClick={() => setMode('light')}>
                  Light
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setMode('dark')}>
                  Dark
                </Dropdown.Item>
              </Dropdown>
            </Dropdown.Context>
          )}
        </div>
      )}
      <>
        {sectionedTokens.map(([section, tokens]) => {
          const tokens_ = tokens as [string, Token[]][];
          const List = () => {
            if (type === 'dimension') {
              return <TokensTable tokens={tokens_} />;
            }

            return (
              <TokenCards
                type={type}
                cols={cardColumns}
                tokens={tokens_}
                hideValue={hideValue}
              />
            );
          };
          return (
            <div key={section as string} className={classes.section}>
              <h3>{capitalizeString(section as string)}</h3>
              <List />
            </div>
          );
        })}
      </>
    </div>
  );
};

export { TokenList };
