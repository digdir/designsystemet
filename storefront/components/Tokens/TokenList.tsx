import React, { useEffect, useState } from 'react';
import * as tokensImport from '@digdir/design-system-tokens';

import { capitalizeString } from '../../utils/StringHelpers';
import { ClipboardBtn } from '../ClipboardBtn/ClipboardBtn';

import { TokenColor } from './TokenColor/TokenColor';
import { TokenFontSize } from './TokenFontSize/TokenFontSize';
import { TokenShadow } from './TokenShadow/TokenShadow';
import { TokenSize } from './TokenSize/TokenSize';
import classes from './TokenList.module.css';

interface TokensProps {
  type: 'color' | 'fontSize' | 'shadow' | 'size';
  showValue?: boolean;
  token: string;
}

type OutputType = {
  [key: string]: string;
};

const formatTitle = (title: string) => {
  return title.replace(/-/g, ' ');
};

const convertJsToCssVariable = (input: string) => {
  return 'fds-' + input.replace(/_/g, '-');
};

const order: { [key: string]: number } = {
  xxsmall: 1,
  xsmall: 2,
  small: 3,
  medium: 4,
  large: 5,
  xlarge: 6,
  xxlarge: 7,
  default: 8,
  hover: 9,
  active: 10,
  suble: 11,
  strong: 12,
};

const sort = (a: string, b: string) => {
  return order[a] - order[b];
};

const TokenList = ({ type, showValue = true, token }: TokensProps) => {
  const [items, setItems] = useState<OutputType>({});
  const tokens: OutputType = tokensImport;

  useEffect(() => {
    const filteredObject: OutputType = {};
    const sortedObject: OutputType = {};

    // Filter down the the correct tokens
    Object.keys(tokens).map((key) => {
      const cssVariable: string = convertJsToCssVariable(key);
      if (cssVariable.startsWith(token)) {
        filteredObject[cssVariable] = tokens[key];
      }
    });

    // Sort the keys by priority and reassemble the new object
    Object.keys(filteredObject)
      .sort((a, b) => {
        const aa = a.split(token)[1].replace('-', '');
        const bb = b.split(token)[1].replace('-', '');
        return sort(aa, bb);
      })
      .forEach(function (v) {
        sortedObject[v] = filteredObject[v];
      });
    setItems(sortedObject);
  }, [token, tokens]);

  return (
    <div className={classes.tokens}>
      <div className={classes.cards}>
        {Object.keys(items).map((key, index) => (
          <div
            key={index}
            className={classes.card}
          >
            <div className={classes.preview}>
              {type === 'color' && <TokenColor value={items[key]} />}
              {type === 'fontSize' && <TokenFontSize value={items[key]} />}
              {type === 'shadow' && <TokenShadow value={items[key]} />}
              {type === 'size' && <TokenSize value={items[key]} />}
            </div>
            <div className={classes.text}>
              <h4 className={classes.title}>
                {capitalizeString(formatTitle(key.split(token)[1]))}
                {showValue && <div className={classes.value}>{items[key]}</div>}
              </h4>
              <div className={classes.copy}>
                <div>--{key}</div>
                <ClipboardBtn text={key} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { TokenList };
