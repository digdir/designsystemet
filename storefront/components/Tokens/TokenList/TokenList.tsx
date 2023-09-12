import type { HTMLAttributes } from 'react';
import React, { useEffect, useState } from 'react';
import { Dropdown, Button } from '@navikt/ds-react';
import cn from 'classnames';
import type { TransformedToken } from 'style-dictionary';

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

type Token = TransformedToken;

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
  return (
    <div
      className={classes.card}
      {...rest}
    >
      <div className={classes.preview}>
        {type === 'color' && <TokenColor value={val} />}
        {type === 'typography' && <TokenFontSize value={val} />}
        {type === 'boxShadow' && <TokenShadow value={val} />}
        {(type === 'sizing' || type === 'spacing') && <TokenSize value={val} />}
      </div>

      <div className={classes.textContainer}>
        <h5 className={classes.title}>
          {capitalizeString(title)}
          <ClipboardBtn
            title='Kopier CSS variabel'
            text='CSS'
            value={token.name}
          />
        </h5>
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

  console.log(sectionedTokens);

  return (
    <div className={classes.tokens}>
      {showThemePicker && (
        <div className={classes.toggleGroup}>
          <Dropdown>
            <Button
              variant='secondary'
              as={Dropdown.Toggle}
            >
              Brand: {capitalizeString(brand)}
            </Button>
            <Dropdown.Menu>
              <Dropdown.Menu.List>
                <Dropdown.Menu.List.Item onClick={() => setBrand('digdir')}>
                  Digdir
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item onClick={() => setBrand('altinn')}>
                  Altinn
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item onClick={() => setBrand('tilsynet')}>
                  Tilsynet
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item onClick={() => setBrand('brreg')}>
                  Brreg
                </Dropdown.Menu.List.Item>
              </Dropdown.Menu.List>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      <>
        {sectionedTokens.map(([section, tokens]) => (
          <>
            <h3>{capitalizeString(section as string)}</h3>
            {(tokens as [string, Token[]][]).map(([group, tokens]) => (
              <div key={group}>
                <h4>{capitalizeString(group)}</h4>
                <div className={classes.section}>
                  <div
                    className={cn(classes.cards, {
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
            ))}
          </>
        ))}
      </>
    </div>
  );
};

export { TokenList };
