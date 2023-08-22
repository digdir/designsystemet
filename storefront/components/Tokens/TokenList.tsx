import React, { useEffect, useState } from 'react';
import { Dropdown, Button } from '@navikt/ds-react';
import cn from 'classnames';

import { capitalizeString } from '../../utils/StringHelpers';
import { ClipboardBtn } from '../ClipboardBtn/ClipboardBtn';
import * as tokens from '../../tokens';

import { TokenColor } from './TokenColor/TokenColor';
import { TokenFontSize } from './TokenFontSize/TokenFontSize';
import { TokenShadow } from './TokenShadow/TokenShadow';
import { TokenSize } from './TokenSize/TokenSize';
import classes from './TokenList.module.css';

type TokenListProps = {
  type: 'color' | 'typography' | 'shadow' | 'size';
  showValue?: boolean;
  token?: string;
  showThemePicker?: boolean;
};

type TokenItemType = {
  value: string;
  type: string;
  description: string;
  filePath: string;
  isSource: boolean;
  original: {
    value: string;
    type: string;
    description: string;
  };
  name: string;
  attributes: Record<string, number>;
  path: string[];
  lastName: string;
};

type CardColumns = 2 | 3;
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

const TokenList = ({ type, showThemePicker }: TokenListProps) => {
  const [brand, setBrand] = useState<BrandType>('digdir');
  const [cardColumns, setCardColumns] = useState<CardColumns>(3);

  useEffect(() => {
    setCardColumns(type === 'color' ? 3 : 2);
  }, [type]);

  const card = (item: TokenItemType, index: number) => {
    return (
      <div
        className={classes.card}
        key={index}
      >
        <div className={classes.preview}>
          {type === 'color' && <TokenColor value={item.value} />}
          {type === 'typography' && <TokenFontSize value={item.value} />}
          {type === 'shadow' && <TokenShadow value={item.value} />}
          {type === 'size' && <TokenSize value={item.value} />}
        </div>

        <div className={classes.text}>
          <h4 className={classes.title}>
            {capitalizeString(item.lastName)}
            <ClipboardBtn
              text='Kopier CSS variabel'
              value={item.name}
            />
          </h4>
          <div className={classes.value}>{item.value}</div>
        </div>
      </div>
    );
  };

  type Color = typeof tokens;
  const tokenList: Color = tokens[brand][type];

  const recursive = (object: Color, level: number, name: string) => {
    level++;
    return (
      <div>
        {Object.keys(object).map((value: string, index: number) => {
          const token = object[value as keyof Color];
          const Heading = `h${level === 1 ? 3 : 4}`;

          name = stripLabelByLevel(name, level);
          name += ' ' + value;

          return (
            <div key={index}>
              {(level === 1 || Array.isArray(token)) && (
                <Heading>{capitalizeString(name)}</Heading>
              )}

              {Array.isArray(token) && (
                <div className={classes.section}>
                  <div
                    className={cn(classes.cards, {
                      [classes.cards2]: cardColumns === 2,
                    })}
                  >
                    {token.map((value, index: number) =>
                      card(value as TokenItemType, index),
                    )}
                  </div>
                </div>
              )}
              {!Array.isArray(token) && recursive(token, level, name)}
            </div>
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
              {capitalizeString(brand)}
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

      <div className={classes.tokens}>{recursive(tokenList, 0, '')}</div>
    </div>
  );
};

export { TokenList };
