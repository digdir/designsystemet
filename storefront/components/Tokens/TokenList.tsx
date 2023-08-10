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

type ListType = {
  [key: string]: any;
};

const TokenList = ({ type }: TokenListProps) => {
  let tokenList: ListType = {};

  if (type === 'color-semantic') {
    tokenList = color.semantic;
  } else {
    tokenList = color.brand;
  }

  const card = (item: TokenType, index: string) => {
    return (
      <div
        className={classes.card}
        key={index}
      >
        <div className={classes.preview}>
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

  return (
    <div className={classes.tokens}>
      {Object.keys(tokenList).map((value, index) => (
        <div key={index}>
          <h3>{capitalizeString(value)}</h3>
          {Array.isArray(tokenList[value]) && (
            <div className={classes.section}>
              <div className={classes.cards}>
                {tokenList[value].map((value: TokenType, index: number) =>
                  card(value, index),
                )}
              </div>
            </div>
          )}
          {!Array.isArray(tokenList[value]) && (
            <div className={classes.section}>
              {Object.keys(tokenList[value]).map((value2, index2) => (
                <div
                  key={index2}
                  className={cn({
                    [classes.section2]: Array.isArray(tokenList[value][value2]),
                  })}
                >
                  {Array.isArray(tokenList[value][value2]) && (
                    <h4>{capitalizeString(value + ' ' + value2)}</h4>
                  )}
                  {Array.isArray(tokenList[value][value2]) && (
                    <div className={classes.cards}>
                      {tokenList[value][value2].map((item3, index3) =>
                        card(item3, index3),
                      )}
                    </div>
                  )}
                  {!Array.isArray(tokenList[value][value2]) && (
                    <div>
                      {Object.keys(tokenList[value][value2]).map(
                        (value3, index3) => (
                          <div
                            key={index3}
                            className={classes.section2}
                          >
                            <h4>
                              {capitalizeString(
                                value + ' ' + value2 + ' ' + value3,
                              )}
                            </h4>
                            <div className={classes.cards}>
                              {tokenList[value][value2][value3].map(
                                (value4, index4) => card(value4, index4),
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { TokenList };
