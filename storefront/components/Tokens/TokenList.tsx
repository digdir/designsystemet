import React, { useEffect, useState } from 'react';
import { Dropdown, Button } from '@navikt/ds-react';
import cn from 'classnames';
import type { TransformedToken } from 'style-dictionary';

import { capitalizeString } from '../../utils/StringHelpers';
import { ClipboardBtn } from '../ClipboardBtn/ClipboardBtn';
import * as tokens from '../../tokens';

import { TokenColor } from './TokenColor/TokenColor';
import { TokenFontSize } from './TokenFontSize/TokenFontSize';
import { TokenShadow } from './TokenShadow/TokenShadow';
import { TokenSize } from './TokenSize/TokenSize';
import classes from './TokenList.module.css';

type TokenListProps = {
  type: 'color' | 'typography' | 'boxShadow' | 'sizing' | 'spacing';
  token?: string;
  showThemePicker?: boolean;
  hideValue?: boolean;
};

type Token = {
  lastName: string;
  name: string;
  value: string;
} & TransformedToken;

type CardColumnType = 2 | 3;
type BrandType = 'digdir' | 'altinn' | 'tilsynet' | 'brreg';

/**
 * Strips words in string by the level
 */
const stripLabelByLevel = (str: string, level: number) => {
  const strArr = str.split(' ');
  let res = '';
  for (let i = 1; i < strArr.length; i++) {
    if (i === level) {
      break;
    }
    res += ' ' + strArr[i];
  }
  return res;
};

type TokenCardProps = {
  item: Token;
  key: number;
  hideValue: TokenListProps['hideValue'];
  type: TokenListProps['type'];
};

const TokenCard = ({ item, key, type, hideValue }: TokenCardProps) => {
  const val = item.value as string;
  return (
    <div
      className={classes.card}
      key={key}
    >
      <div className={classes.preview}>
        {type === 'color' && <TokenColor value={val} />}
        {type === 'typography' && <TokenFontSize value={val} />}
        {type === 'boxShadow' && <TokenShadow value={val} />}
        {(type === 'sizing' || type === 'spacing') && <TokenSize value={val} />}
      </div>

      <div className={classes.textContainer}>
        <h4 className={classes.title}>
          {capitalizeString(item.lastName)}
          <ClipboardBtn
            text='Kopier CSS variabel'
            value={item.name}
          />
        </h4>
        {!hideValue && <div className={classes.value}>{item.value}</div>}
      </div>
    </div>
  );
};

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

  const brandTypeTokens = tokens[brand][type] as unknown as Record<
    string,
    Token
  >;

  const recursive = <T extends Partial<Record<string, Token>>>(
    tokens: T,
    level = 0,
    name = '',
  ) => {
    level++;
    return (
      <div>
        {Object.keys(tokens).map((value: string, index: number) => {
          const token = tokens[value];
          const DynamicHeading: keyof JSX.IntrinsicElements = `h${
            level === 1 ? 3 : 4
          }`;

          name = stripLabelByLevel(name, level);
          name += ' ' + value;

          return (
            token && (
              <div key={index}>
                {(level === 1 || Array.isArray(token)) && (
                  <DynamicHeading>{capitalizeString(name)}</DynamicHeading>
                )}

                {Array.isArray(token) ? (
                  <div className={classes.section}>
                    <div
                      className={cn(classes.cards, {
                        [classes.cards2]: cardColumns === 2,
                      })}
                    >
                      {token.map((value, index: number) => (
                        <TokenCard
                          item={value as Token}
                          key={index}
                          hideValue={hideValue}
                          type={type}
                        ></TokenCard>
                      ))}
                    </div>
                  </div>
                ) : (
                  recursive(
                    token as unknown as Record<string, Token>,
                    level,
                    name,
                  )
                )}
              </div>
            )
          );
        })}
      </div>
    );
  };

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
      {recursive(brandTypeTokens)}
    </div>
  );
};

export { TokenList };
