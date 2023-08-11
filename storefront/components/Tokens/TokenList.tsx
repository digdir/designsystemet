import React from 'react';
import cn from 'classnames';

import { capitalizeString } from '../../utils/StringHelpers';
import { ClipboardBtn } from '../ClipboardBtn/ClipboardBtn';
import { color } from '../../tokens/tokens';

import { TokenColor } from './TokenColor/TokenColor';
import { TokenFontSize } from './TokenFontSize/TokenFontSize';
import { TokenShadow } from './TokenShadow/TokenShadow';
import { TokenSize } from './TokenSize/TokenSize';
import classes from './TokenList.module.css';

type TokenListProps = {
  type: 'color-brand' | 'color-semantic' | 'fontSize' | 'shadow' | 'size';
  showValue?: boolean;
  token?: string;
};

type TokenType = {
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

const TokenList = ({ type }: TokenListProps) => {
  const card = (item: TokenType, index: number) => {
    return (
      <div
        className={classes.card}
        key={index}
      >
        <div className={classes.preview}>
          <TokenColor value={item.value} />
          {type === 'color-brand' && <TokenColor value={item.value} />}
          {type === 'color-semantic' && <TokenColor value={item.value} />}
          {type === 'fontSize' && <TokenFontSize value={item.value} />}
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

  type Color = typeof color.semantic;
  const tokenList: Color = color.semantic;

  const recursive = (object: Color, level: number, name: string) => {
    return (
      <div>
        {Object.keys(object).map((value: string, index: number) => {
          const token = object[value as keyof Color];
          const Heading = `h${level === 0 ? 3 : 4}`;
          console.log(value);
          name += ' ' + value;
          level++;
          return (
            <div key={index}>
              <Heading>
                {capitalizeString(name)} {level}
              </Heading>

              {Array.isArray(token) && (
                <div className={classes.section}>
                  <div className={classes.cards}>
                    {token.map((value, index: number) =>
                      card(value as TokenType, index),
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

  return <div className={classes.tokens}>{recursive(tokenList, 0, '')}</div>;
};

export { TokenList };
