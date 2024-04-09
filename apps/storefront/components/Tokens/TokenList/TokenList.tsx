import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import cl from 'clsx';
import type { TransformedToken as Token } from 'style-dictionary';
import { DropdownMenu, Link, Paragraph } from '@digdir/designsystemet-react';

import { capitalizeString } from '../../../utils/StringHelpers';
import { ClipboardBtn } from '../../ClipboardBtn/ClipboardBtn';
import * as tokens from '../../../tokens';
import { TokenColor } from '../TokenColor/TokenColor';
import { TokenFontSize } from '../TokenFontSize/TokenFontSize';
import { TokenShadow } from '../TokenShadow/TokenShadow';
import { TokenSize } from '../TokenSize/TokenSize';

import classes from './TokenList.module.css';

type TokenListProps = {
  type: 'color' | 'typography' | 'boxShadow' | 'sizing' | 'spacing';
  token?: string;
  showThemePicker?: boolean;
  hideValue?: boolean;
};

type CardColumnType = 2 | 3;
type BrandType = 'digdir' | 'altinn' | 'tilsynet' | 'brreg';

type TokenCardProps = {
  token: Token;
  hideValue: TokenListProps['hideValue'];
  type: TokenListProps['type'];
} & HTMLAttributes<HTMLDivElement>;

const TokenCard = ({ token, type, hideValue, ...rest }: TokenCardProps) => {
  const val = token.value as string;
  const title = token.path
    .slice(token.path.length - 1, token.path.length)
    .toString();

  const isSlim = type === 'sizing' || type === 'spacing';
  return (
    <div
      className={classes.card}
      {...rest}
    >
      <div className={classes.preview}>
        {type === 'color' && <TokenColor value={val} />}
        {type === 'typography' && <TokenFontSize value={val} />}
        {type === 'boxShadow' && <TokenShadow value={val} />}
        {isSlim && <TokenSize value={val} />}
      </div>

      <div className={classes.textContainer}>
        <h4 className={classes.title}>
          {capitalizeString(title)}
          &nbsp;
          {isSlim && typeof token.description === 'string' && (
            <small>{`(${token.description})`}</small>
          )}
          <ClipboardBtn
            title='Kopier CSS variabel'
            text='CSS'
            value={token.name}
          />
        </h4>
        {!hideValue && <div className={classes.value}>{token.value}</div>}
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
  type = 'color',
  hideValue = false,
}: TokenListProps) => {
  const [brand, setBrand] = useState<BrandType>('digdir');
  const [cardColumns, setCardColumns] = useState<CardColumnType>(3);

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
        <Paragraph size='small'>@digdir/designsystemet-theme</Paragraph>
      </div>
      {showThemePicker && (
        <div className={classes.toggleGroup}>
          <DropdownMenu>
            <DropdownMenu.Trigger variant='secondary'>
              Brand: {capitalizeString(brand)}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={() => setBrand('digdir')}>
                Digdir
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setBrand('altinn')}>
                Altinn
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setBrand('tilsynet')}>
                Tilsynet
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setBrand('brreg')}>
                Brreg
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      )}
      <>
        {sectionedTokens.map(([section, tokens]) => (
          <div
            key={section as string}
            className={classes.section}
          >
            <h3>{capitalizeString(section as string)}</h3>
            {(tokens as [string, Token[]][]).map(([group, tokens]) => {
              const isSlim = type === 'sizing' || type === 'spacing';

              return (
                <div key={group}>
                  {!isSlim && <h4>{capitalizeString(group)}</h4>}
                  <div className={cl(!isSlim && classes.group)}>
                    <div
                      className={cl(classes.cards, {
                        [classes.cards2]: cardColumns === 2,
                      })}
                    >
                      {tokens.map((token) => (
                        <TokenCard
                          token={token}
                          key={token.name}
                          hideValue={hideValue}
                          type={type}
                        ></TokenCard>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </>
    </div>
  );
};

export { TokenList };
